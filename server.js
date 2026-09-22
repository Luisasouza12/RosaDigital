const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, 'public');
const DB = path.join(__dirname, 'data', 'database.json');

function readDB(){ return JSON.parse(fs.readFileSync(DB,'utf8')); }
function writeDB(db){ const tmp=DB+'.tmp'; fs.writeFileSync(tmp,JSON.stringify(db,null,2)); fs.renameSync(tmp,DB); }
function id(){ return crypto.randomUUID(); }
function send(res,status,data,type='application/json; charset=utf-8'){ res.writeHead(status,{'Content-Type':type,'Cache-Control':'no-store'}); res.end(type.startsWith('application/json')?JSON.stringify(data):data); }
function body(req){ return new Promise((resolve,reject)=>{let s='';req.on('data',c=>{s+=c;if(s.length>1e6){req.destroy();reject(new Error('Payload muito grande'));}});req.on('end',()=>{try{resolve(s?JSON.parse(s):{});}catch(e){reject(e);}});}); }
function safe(s=''){ return String(s).trim(); }

async function api(req,res,url){
  const db=readDB(); const parts=url.pathname.split('/').filter(Boolean); const resource=parts[1]; const itemId=parts[2];
  if(req.method==='GET' && url.pathname==='/api/dashboard'){
    return send(res,200,{people:db.people.length,families:db.families.length,workshops:db.workshops.filter(x=>x.active).length,attendances:db.attendances.length});
  }
  if(req.method==='GET' && resource && ['people','families','workshops','attendances'].includes(resource)) return send(res,200,db[resource]);
  if(req.method==='POST' && resource && ['people','families','workshops','attendances'].includes(resource)){
    try{const b=await body(req); const now=new Date().toISOString();
      if(resource==='people' && !safe(b.name)) return send(res,400,{error:'Nome é obrigatório.'});
      if(resource==='families' && !safe(b.responsible)) return send(res,400,{error:'Responsável é obrigatório.'});
      if(resource==='workshops' && !safe(b.name)) return send(res,400,{error:'Nome da oficina é obrigatório.'});
      if(resource==='attendances' && (!b.personId||!b.workshopId||!b.date)) return send(res,400,{error:'Pessoa, oficina e data são obrigatórios.'});
      const row={id:id(),...b,createdAt:now,updatedAt:now}; db[resource].push(row); writeDB(db); return send(res,201,row);
    }catch(e){return send(res,400,{error:'Dados inválidos.'});}
  }
  if(req.method==='PUT' && resource && itemId && ['people','families','workshops','attendances'].includes(resource)){
    try{const b=await body(req); const i=db[resource].findIndex(x=>x.id===itemId); if(i<0)return send(res,404,{error:'Registro não encontrado.'}); db[resource][i]={...db[resource][i],...b,id:itemId,updatedAt:new Date().toISOString()}; writeDB(db); return send(res,200,db[resource][i]);}catch(e){return send(res,400,{error:'Dados inválidos.'});}
  }
  if(req.method==='DELETE' && resource && itemId && ['people','families','workshops','attendances'].includes(resource)){
    const i=db[resource].findIndex(x=>x.id===itemId); if(i<0)return send(res,404,{error:'Registro não encontrado.'}); db[resource].splice(i,1); if(resource==='people') db.attendances=db.attendances.filter(a=>a.personId!==itemId); writeDB(db); return send(res,200,{ok:true});
  }
  send(res,404,{error:'Rota não encontrada.'});
}

const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'text/javascript; charset=utf-8','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer(async(req,res)=>{try{const url=new URL(req.url,`http://${req.headers.host}`); if(url.pathname.startsWith('/api/')) return api(req,res,url); let rel=url.pathname==='/'?'index.html':url.pathname.slice(1); let file=path.normalize(path.join(PUBLIC,rel)); if(!file.startsWith(PUBLIC)) return send(res,403,'Acesso negado','text/plain'); fs.readFile(file,(err,data)=>{if(err)return send(res,404,'Página não encontrada','text/plain'); send(res,200,data,types[path.extname(file)]||'application/octet-stream');});}catch(e){send(res,500,{error:'Erro interno.'});}});
server.listen(PORT,()=>console.log(`Rosa Digital disponível em http://localhost:${PORT}`));
