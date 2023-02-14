<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

# OnFly Test Technical

Este é um projeto de teste técnico da OnFly, desenvolvido com NestJS.


## Características do Projeto

- Node.js
- Typescript
- ORM: **Sequelize**
- Banco de Dados: **SQLite**
- Jest


## Testando a API com Swagger:

A API possui uma documentação interativa feita com o Swagger, que permite que você teste os endpoints sem a necessidade de escrever código ou usar ferramentas externas. Para acessá-lo, basta ir até a URL http://localhost:3000/api no seu navegador.

O Swagger irá exibir todos os endpoints disponíveis na API, incluindo a descrição de cada um, quais parâmetros devem ser enviados e o tipo de retorno esperado. Para testar um endpoint, basta clicar na sua descrição, preencher os parâmetros necessários (se houver) e clicar em "Try it out". O Swagger irá fazer uma chamada para o endpoint e exibir a resposta na tela.


## Protegendo a API com JWT:

A API está protegida com o uso de Tokens JWT (JSON Web Tokens). Isso significa que a maioria dos endpoints só poderá ser acessada com um token válido, que deve ser enviado no cabeçalho da requisição com a chave `Authorization` e o valor `<access_token>`.

Para obter um token, você deve fazer uma chamada para o endpoint de autenticação, passando as credenciais corretas (email e senha). Em resposta, você receberá um token, que deve ser usado nas requisições subsequentes.

Importante lembrar que:
- Usuário deve ser registrado antes de solicitar um token.
- Tokens possuem uma data de expiração de duração 1 hora, então você precisará obter um novo token após a expiração do anterior.


# Scripts

## Instalação

```bash
git clone https://github.com/lucascdornelas/onfly-technical-test.git
```

```bash
$ npm install
```


## Rodando a aplicação

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```


## Teste

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```


# License

Nest is [MIT licensed](LICENSE).
