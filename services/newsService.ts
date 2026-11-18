import { cacheLife, cacheTag } from "next/cache";
import { obterApiUrl } from "../lib/api";
import type { NoticiaDetalhe, NoticiaResumo } from "../types/News";

export async function buscarNoticiasPublicadas(): Promise<NoticiaResumo[]> {
  "use cache";

  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 3600,
  });

  cacheTag("noticias");

  const resposta = await fetch(`${obterApiUrl()}/api/Noticias`);

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar as notícias.");
  }

  return (await resposta.json()) as NoticiaResumo[];
}

export async function buscarNoticiaPorSlug(
  slug: string,
): Promise<NoticiaDetalhe | null> {
  "use cache";

  cacheLife({
    stale: 300,
    revalidate: 300,
    expire: 86400,
  });

  cacheTag("noticias", `noticia:${slug}`);

  const resposta = await fetch(
    `${obterApiUrl()}/api/Noticias/${encodeURIComponent(slug)}`,
  );

  if (resposta.status === 404) return null;

  if (!resposta.ok) {
    throw new Error("Não foi possível carregar a notícia.");
  }

  return (await resposta.json()) as NoticiaDetalhe;
}
