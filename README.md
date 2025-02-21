# API de Consulta de CEP

Esta é uma API REST desenvolvida em NestJS que alterna aleatoriamente entre duas APIs de consulta de CEP (ViaCEP e BrasilAPI) e retorna os dados em um formato padronizado.

## Funcionalidades

- **Consulta de CEP**: Retorna o endereço de um CEP específico.
- **Alternância Aleatória**: Alterna aleatoriamente entre as APIs ViaCEP e BrasilAPI para cada requisição.
- **Fallback Automático**: Em caso de falha em uma API, a aplicação tenta automaticamente a outra API.
- **Resposta Padronizada**: Os dados retornados são unificados em um formato padronizado, independentemente da API utilizada.

## Tecnologias Utilizadas

- **NestJS**: Framework Node.js para construção de aplicações server-side eficientes e escaláveis.
- **Axios**: Cliente HTTP para realizar requisições às APIs de CEP.
- **TypeScript**: Linguagem utilizada para tipagem e desenvolvimento da aplicação.
- **Swagger**: Documentação interativa da API.

## Como Executar

### Pré-requisitos

- Node.js (v20.18.3 ou superior)
- npm ou yarn
- Git

### Instalação

**1. Clone o repositório:**

```bash
git clone git@github.com:rodrigobunhak/find-address-api.git
```

**2. Navegue até o diretório do projeto:**

```bash
cd find-address-api
```

**3. Instale as dependências:**

```bash
npm install
```

ou

```bash
yarn install
```

**4. Execute a aplicação:**

```bash
npm run start:dev
```

ou

```bash
yarn start
```

## Testes

```base
npm run test
```

## Endpoints

### GET /cep/{cep}

Retorna informações sobre o CEP especificado.

**Exemplo de Requisição:**

```bash
GET /cep/84600275
```

**Exemplo de resposta**

```bash
{
	"cep": "84600275",
	"uf": "PR",
	"state": "Paraná",
	"city": "União da Vitória",
	"neighborhood": "Centro",
	"street": "Rua Ipiranga",
	"fullAddress": "Rua Ipiranga, Centro, União da Vitória, Paraná, PR, CEP 84600-275"
}
```

## Documentação da API

A documentação interativa da API pode ser acessada em http://localhost:3000/api após iniciar a aplicação.
