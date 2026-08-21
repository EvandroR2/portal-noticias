export type Noticia = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string | null;
  imagem_url: string | null;
  imagem_alt: string | null;
  autor: string | null;
  publicada: boolean;
  publicado_em: string;
  criado_em: string;
  atualizado_em: string;
  seo_titulo: string | null;
  seo_descricao: string | null;
  imagem_social_url: string | null;
};