# Portal de Notícias

Portal de notícias desenvolvido como projeto de portfólio para publicação de comentários, análises e conteúdos baseados em notícias externas. O sistema possui área pública, painel administrativo e uma API própria para centralizar autenticação e acesso ao banco de dados.

## Projeto publicado

- Frontend: [portal-noticias-three-zeta.vercel.app](https://portal-noticias-three-zeta.vercel.app)
- API: [portal-noticias-api-vuqg.onrender.com](https://portal-noticias-api-vuqg.onrender.com)
- Health check: [portal-noticias-api-vuqg.onrender.com/health](https://portal-noticias-api-vuqg.onrender.com/health)

## Arquitetura

```text
Navegador
   ↓
Next.js na Vercel
   ↓
API ASP.NET Core no Render
   ↓
PostgreSQL no Supabase
```

O Next.js não acessa o banco diretamente. Todas as consultas e operações administrativas passam pela API ASP.NET Core.

## Funcionalidades

### Área pública

- listagem de notícias publicadas;
- página individual baseada em `slug`;
- suporte a imagens externas de diferentes fontes;
- fallback visual quando uma imagem externa não está disponível;
- metadados dinâmicos para SEO e compartilhamento;
- dados estruturados no formato `NewsArticle`;
- sitemap e robots gerados pelo Next.js;
- página 404.

### Área administrativa

- autenticação com ASP.NET Identity e JWT;
- token armazenado em cookie `HttpOnly`;
- controle de acesso pelo perfil `Admin`;
- listagem de notícias publicadas e rascunhos;
- cadastro, edição, publicação e exclusão;
- confirmação pelo título antes da exclusão definitiva;
- geração automática de slugs únicos;
- campos de fonte, imagem, acessibilidade e SEO.

### API

- ASP.NET Core Web API;
- Entity Framework Core com PostgreSQL;
- autenticação Bearer JWT;
- documentação OpenAPI com interface Scalar em desenvolvimento;
- migrations separadas para notícias e autenticação;
- health check público em `/health`;
- imagem Docker para implantação no Render.

## Tecnologias

### Frontend

- Next.js 16;
- React 19;
- TypeScript;
- CSS;
- Vercel.

### Backend

- ASP.NET Core 10;
- Entity Framework Core 10;
- ASP.NET Identity;
- JWT Bearer;
- Npgsql;
- OpenAPI e Scalar;
- Docker;
- Render.

### Dados

- PostgreSQL;
- Supabase Session Pooler.

## Endpoints principais

| Método | Endpoint | Acesso | Descrição |
|---|---|---|---|
| `GET` | `/health` | Público | Verifica a disponibilidade da API |
| `GET` | `/api/Noticias` | Público | Lista notícias publicadas |
| `GET` | `/api/Noticias/{slug}` | Público | Retorna uma notícia publicada |
| `POST` | `/api/auth/login` | Público | Autentica e retorna um JWT |
| `GET` | `/api/Noticias/admin` | Admin | Lista publicadas e rascunhos |
| `GET` | `/api/Noticias/admin/{id}` | Admin | Retorna uma notícia pelo ID |
| `POST` | `/api/Noticias` | Admin | Cadastra uma notícia |
| `PUT` | `/api/Noticias/{id}` | Admin | Atualiza uma notícia |
| `DELETE` | `/api/Noticias/{id}` | Admin | Exclui uma notícia definitivamente |

## Estrutura do repositório

```text
portal-noticias/
├── app/                         Rotas, páginas e handlers do Next.js
├── components/                  Componentes reutilizáveis
├── lib/                         Configurações compartilhadas
├── services/                    Consumo da API
├── types/                       Tipos TypeScript
├── public/                      Arquivos públicos
└── backend/
    └── PortalNoticias/
        ├── PortalNoticias.slnx
        └── PortalNoticias/
            ├── Controllers/
            ├── Data/
            ├── DTOs/
            ├── Models/
            ├── OpenApi/
            ├── Services/
            ├── Validation/
            ├── Dockerfile
            └── Program.cs
```

## Execução local

### Pré-requisitos

- Node.js compatível com o Next.js 16;
- .NET SDK 10;
- acesso a uma instância PostgreSQL;
- banco com as migrations do projeto aplicadas.

### API ASP.NET Core

Entre no projeto da API:

```powershell
cd backend/PortalNoticias/PortalNoticias
```

Configure os segredos localmente com o Visual Studio em **Gerenciar Segredos do Usuário** ou pelo terminal:

```powershell
dotnet user-secrets set "ConnectionStrings:PortalNoticias" "SUA_STRING_DE_CONEXAO"
dotnet user-secrets set "Jwt:Key" "SUA_CHAVE_JWT"
dotnet user-secrets set "Jwt:Issuer" "PortalNoticias.Api"
dotnet user-secrets set "Jwt:Audience" "PortalNoticias.Clientes"
dotnet user-secrets set "Jwt:ExpirationMinutes" "60"
```

Execute a API:

```powershell
dotnet run --launch-profile https
```

Endereços locais:

```text
API:       https://localhost:7074
Scalar:    https://localhost:7074/scalar
OpenAPI:   https://localhost:7074/openapi/v1.json
Health:    https://localhost:7074/health
```

### Frontend Next.js

Na raiz do repositório, crie `.env.local`:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PORTAL_API_URL=http://localhost:5105
```

Instale as dependências e execute:

```powershell
npm install
npm run dev
```

O frontend ficará disponível em [localhost:3000](http://localhost:3000).

## Validação

Frontend:

```powershell
npm run lint
npm run build
```

Backend:

```powershell
dotnet build backend/PortalNoticias/PortalNoticias.slnx --configuration Release
```

## Variáveis de produção

### Vercel

```text
PORTAL_API_URL
NEXT_PUBLIC_SITE_URL
```

### Render

```text
ConnectionStrings__PortalNoticias
Jwt__Key
Jwt__Issuer
Jwt__Audience
Jwt__ExpirationMinutes
ASPNETCORE_ENVIRONMENT
```

Os valores de conexão e a chave JWT não devem ser adicionados ao Git. Em desenvolvimento eles ficam em User Secrets; em produção, nas variáveis protegidas da plataforma.

## Implantação

### API no Render

```text
Runtime: Docker
Root Directory: backend/PortalNoticias
Docker Build Context: backend/PortalNoticias
Dockerfile: backend/PortalNoticias/PortalNoticias/Dockerfile
Health Check Path: /health
```

A API lê a variável `PORT` fornecida automaticamente pelo Render e escuta em `0.0.0.0`.

### Frontend na Vercel

```text
Framework: Next.js
Root Directory: ./
Production Branch: main
```

O frontend utiliza `PORTAL_API_URL` no servidor para se comunicar com a API sem expor o JWT ao JavaScript do navegador.

## Banco de dados

A tabela `noticias` contém, entre outros, os campos:

```text
id
slug
titulo
resumo
conteudo
categoria
imagem_url
imagem_alt
autor
fonte_url
criado_por
publicada
publicado_em
criado_em
atualizado_em
seo_titulo
seo_descricao
imagem_social_url
```

O campo `slug` é único. `criado_por` referencia o usuário do ASP.NET Identity que cadastrou a notícia.

## Segurança

- credenciais e chaves não são versionadas;
- senhas são armazenadas pelo ASP.NET Identity;
- endpoints administrativos exigem JWT e perfil `Admin`;
- o token do painel é armazenado em cookie `HttpOnly`;
- URLs externas aceitam somente os protocolos `http` e `https`;
- o Render encerra o TLS e encaminha o tráfego interno ao contêiner;
- `.env.local`, User Secrets, `bin`, `obj` e arquivos locais do Visual Studio são ignorados pelo Git.
