import "server-only";

import { obterApiUrl } from "@/lib/api";

export type NoticiaAdmin = {
  id: number;
  slug: string;
  titulo: string;
  categoria: string | null;
  autor: string | null;
  publicada: boolean;
  publicadoEm: string;
  criadoEm: string;
  atualizadoEm: string;
};

export type NoticiaAdminDetalhe = {
  id: number;
  slug: string;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string | null;
  imagemUrl: string | null;
  imagemAlt: string | null;
  autor: string | null;
  fonteUrl: string | null;
  publicada: boolean;
  publicadoEm: string;
  seoTitulo: string | null;
  seoDescricao: string | null;
  imagemSocialUrl: string | null;
};

type ResultadoNoticias =
  | { sucesso: true; noticias: NoticiaAdmin[] }
  | { sucesso: false; status: number; mensagem: string };

export async function listarNoticiasAdmin(
  token: string,
): Promise<ResultadoNoticias> {
  try {
    const resposta = await fetch(`${obterApiUrl()}/api/Noticias/admin`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });

    if (!resposta.ok) {
      return {
        sucesso: false,
        status: resposta.status,
        mensagem: "Não foi possível carregar as notícias.",
      };
    }

    return {
      sucesso: true,
      noticias: (await resposta.json()) as NoticiaAdmin[],
    };
  } catch {
    return {
      sucesso: false,
      status: 503,
      mensagem: "A API de notícias não está disponível no momento.",
    };
  }
}

type ResultadoNoticia =
  | { sucesso: true; noticia: NoticiaAdminDetalhe }
  | { sucesso: false; status: number; mensagem: string };

export async function obterNoticiaAdmin(
  token: string,
  id: number,
): Promise<ResultadoNoticia> {
  try {
    const resposta = await fetch(
      `${obterApiUrl()}/api/Noticias/admin/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      },
    );

    if (!resposta.ok) {
      return {
        sucesso: false,
        status: resposta.status,
        mensagem: "Não foi possível carregar a notícia.",
      };
    }

    return {
      sucesso: true,
      noticia: (await resposta.json()) as NoticiaAdminDetalhe,
    };
  } catch {
    return {
      sucesso: false,
      status: 503,
      mensagem: "A API de notícias não está disponível no momento.",
    };
  }
}
