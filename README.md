# Portal de Notícias

Portal de notícias desenvolvido com React, TypeScript e Supabase. O projeto permite consultar notícias armazenadas em um banco de dados PostgreSQL e visualizar o conteúdo completo em páginas individuais.

## Funcionalidades

- Listagem de notícias publicadas
- Integração com PostgreSQL pelo Supabase
- Página de detalhes de cada notícia
- Rotas dinâmicas com React Router
- Ordenação das notícias por data
- Estados de carregamento e tratamento de erros
- Layout responsivo
- Proteção dos dados com Row Level Security (RLS)

## Tecnologias

- React
- TypeScript
- Vite
- React Router
- Supabase
- PostgreSQL
- CSS

## Estrutura do projeto

```text
src/
├── components/
│   └── NewsCard/
├── lib/
│   └── supabase.ts
├── pages/
│   ├── Home/
│   └── NewsDetails/
├── services/
│   └── newsService.ts
├── types/
│   └── News.ts
├── App.tsx
└── main.tsx
```

## Como executar

Clone o repositório:

```bash
git clone https://github.com/EvandroR2/portal-noticias.git
```

Entre na pasta:

```bash
cd portal-noticias
```

Instale as dependências:

```bash
npm install
```

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-publica
```

Inicie o servidor:

```bash
npm run dev
```

A aplicação ficará disponível normalmente em:

```text
http://localhost:5173
```

## Banco de dados

O projeto utiliza uma tabela `noticias` no Supabase com a seguinte estrutura:

```text
id
titulo
resumo
conteudo
categoria
imagem_url
publicada
criado_em
atualizado_em
```

A leitura pública permite apenas notícias com:

```text
publicada = true
```

As permissões são controladas por políticas de Row Level Security do Supabase.

## Segurança

O arquivo `.env.local` não deve ser enviado ao GitHub.

Nunca coloque no frontend:

- senha do banco de dados;
- chave `service_role`;
- secret key;
- string de conexão administrativa.

A chave `publishable` do Supabase é utilizada no navegador em conjunto com políticas RLS.

## Comandos disponíveis

Executar em desenvolvimento:

```bash
npm run dev
```

Verificar o código:

```bash
npm run lint
```

Gerar a versão de produção:

```bash
npm run build
```

Visualizar a versão gerada:

```bash
npm run preview
```

## Próximas funcionalidades

- Autenticação administrativa
- Painel de gerenciamento
- Cadastro de notícias
- Edição e exclusão
- Publicação e armazenamento de rascunhos
- Envio de imagens pelo Supabase Storage
- Pesquisa por título
- Filtro por categoria
- Paginação
- Publicação na Vercel

## Autor

Desenvolvido por **Evandro Edgariano**.

- GitHub: [EvandroR2](https://github.com/EvandroR2)
- LinkedIn: [Evandro Edgariano](https://www.linkedin.com/in/evandro-edgariano-b8b627184/)