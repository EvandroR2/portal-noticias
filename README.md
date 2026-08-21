# Portal de Notícias

Portal de notícias desenvolvido com Next.js, React, TypeScript e Supabase. As páginas públicas são renderizadas no servidor e cada notícia possui uma URL baseada em `slug`.

## Funcionalidades

- listagem de notícias publicadas;
- página individual em `/noticias/[slug]`;
- metadados dinâmicos para SEO e compartilhamento;
- sitemap e robots gerados pelo Next.js;
- página 404;
- imagens otimizadas pelo Next.js;
- leitura pública protegida pelas políticas RLS do Supabase.

## Variáveis de ambiente

Crie `.env.local` na raiz:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publica
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Nunca use no frontend a chave `service_role`, senha do banco ou string de conexão administrativa.

## Execução

```bash
npm install
npm run dev
```

A aplicação ficará disponível em `http://localhost:3000`.

## Validação

```bash
npm run lint
npm run build
```

## Estrutura

```text
app/                Rotas e páginas do Next.js
components/         Componentes reutilizáveis
lib/supabase/       Cliente Supabase para o servidor
services/           Consultas de notícias
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

O campo `slug` deve ser único. A política RLS deve permitir leitura anônima apenas quando `publicada = true`.
