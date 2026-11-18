export type NoticiaResumo = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string | null;
  imagemUrl: string | null;
  imagemAlt: string | null;
  autor: string | null;
  publicadoEm: string;
};

export type NoticiaDetalhe = NoticiaResumo & {
  conteudo: string;
  fonteUrl: string | null;
  publicada: boolean;
  criadoEm: string;
  atualizadoEm: string;
  seoTitulo: string | null;
  seoDescricao: string | null;
  imagemSocialUrl: string | null;
};
