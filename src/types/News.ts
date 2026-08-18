export type Noticia = {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string | null;
  imagem_url: string | null;
  publicada: boolean;
  criado_em: string;
  atualizado_em: string;
};