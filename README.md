# Rosa Digital

Sistema web desenvolvido como projeto de extensão para apoiar a organização de cadastros da Associação Rosa de Ouro.

## O que o sistema faz
- Painel com números de pessoas, famílias, participações e oficinas.
- Cadastro, edição, busca e exclusão de pessoas.
- Vínculo de pessoas às oficinas.
- Cadastro, edição e exclusão de famílias.
- Cadastro e gestão de oficinas.
- Registro do histórico de participações/presenças.
- Layout responsivo para computador e celular.
- Persistência local dos dados.

## Como executar (Windows)
1. Tenha Node.js 18 ou superior instalado.
2. Extraia a pasta do projeto.
3. Abra o terminal dentro da pasta `RosaDigital`.
4. Execute:
   `npm start`
5. Abra no navegador:
   `http://localhost:3000`

Não é necessário executar `npm install`, pois esta versão utiliza apenas recursos nativos do Node.js.

## Onde os dados ficam salvos?
Os dados são armazenados em:
`data/database.json`

O navegador não é o banco de dados. O servidor grava cada cadastro nesse arquivo. Ao fechar o navegador e abrir novamente, os dados continuam lá. Se o computador for desligado, os dados também permanecem salvos no arquivo.

### Backup
Para fazer backup, feche o servidor e copie o arquivo `data/database.json` para um local seguro (Google Drive, pendrive, OneDrive etc.). Para restaurar, substitua o arquivo pelo backup.

## Importante para uso real
Esta entrega é um MVP acadêmico. Para uso real com dados pessoais, especialmente CPF, endereço e telefone, recomenda-se hospedagem segura, autenticação individual, HTTPS, controle de acesso e política de backup/privacidade compatível com a LGPD. Por isso, esta versão não solicita CPF por padrão.

## Estrutura
- `server.js`: servidor web e API.
- `public/index.html`: estrutura visual.
- `public/style.css`: aparência e responsividade.
- `public/app.js`: telas, formulários e integração com API.
- `data/database.json`: armazenamento persistente.
