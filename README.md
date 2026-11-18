# Portal de Notícias

Portal de notícias desenvolvido com Next.js, React, TypeScript e uma API ASP.NET Core. A API utiliza PostgreSQL no Supabase, e cada notícia possui uma URL pública baseada em `slug`.

## Funcionalidades

- listagem de notícias publicadas;
- página individual em `/noticias/[slug]`;
- metadados dinâmicos para SEO e compartilhamento;
- sitemap e robots gerados pelo Next.js;
- página 404;
- imagens otimizadas pelo Next.js;
- painel administrativo com autenticação JWT;
- cadastro, edição, publicação e exclusão de notícias;
- API documentada com OpenAPI e Scalar.

## Variáveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
PORTAL_API_URL=http://localhost:5105
```

As credenciais do PostgreSQL e a chave JWT devem ser configuradas somente na API, por meio de User Secrets no desenvolvimento e variáveis de ambiente na hospedagem.

## Execução

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`. A API ASP.NET Core também deve estar em execução.

## Validação

```bash
npm run lint
npm run build
```

## Estrutura

```text
app/                Rotas e páginas do Next.js
components/         Componentes reutilizáveis
backend/            API ASP.NET Core e acesso ao PostgreSQL
lib/                Configurações compartilhadas do frontend
services/           Consumo da API de notícias
types/              Tipos TypeScript
public/             Arquivos públicos
```

## Tabela `noticias`

A aplicação utiliza, entre outros, os campos:

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
publicada
publicado_em
criado_em
atualizado_em
seo_titulo
seo_descricao
imagem_social_url
```

O campo `slug` deve ser único. O acesso ao banco é realizado pela API ASP.NET Core.
