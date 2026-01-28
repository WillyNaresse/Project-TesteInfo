# TesteInfo

Este projeto foi gerado com o [Angular CLI](https://github.com/angular/angular-cli) versão 18.2.12.

O ambiente de desenvolvimento foi configurado para executar front-end e o back-end mockado (json-server) simultaneamente através de um script customizado (npm run dev), facilitando o setup e o desenvolvimento local. O mesmo não possui testes unitários.


## Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:

- Node.js (versão LTS recomendada)

- npm (instalado junto com o Node.js)

- Angular CLI (opcional, mas recomendado)


## Como rodar o projeto (Desenvolvimento)

- Etapa 1 — Instalar as dependências

Na raiz do projeto, execute `npm install`

Esse comando irá instalar todas as dependências necessárias para o front-end e para o back-end.

- Etapa 2 — Executar o projeto

Para iniciar o ambiente de desenvolvimento, utilize `npm run dev`

Esse comando executa a aplicação Angular e o back-end mock utilizando json-server


## Endereços da aplicação

Após iniciar o projeto, os serviços estarão disponíveis em `http://localhost:4200/` (Angular) e `http://localhost:3000/` (json-server)

O back-end utiliza o json-server com o arquivo db.json, localizado na raiz do projeto, servindo como base de dados mock para a aplicação.


## Criação de código (Scaffolding)

Para gerar novos artefatos utilizando o Angular CLI, digite `ng generate component nome-do-componente`

Outros exemplos: `ng generate directive|pipe|service|class|guard|interface|enum|module`


## Build do projeto

Para gerar a build de produção, `ng build`

Os arquivos compilados serão armazenados no diretório `dist/`


## Ajuda adicional

Para mais informações sobre o Angular CLI, `ng help` ou consulte a [documentação oficial](https://angular.dev/tools/cli)

Para qualquer outro tipo de dúvida, ajuda ou feedback sobre esta aplicação, entrar em contato através do e-mail willnaresse@gmail.com.
