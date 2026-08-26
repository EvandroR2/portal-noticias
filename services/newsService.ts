import { cacheLife, cacheTag } from "next/cache";
import { criarSupabaseServer } from "../lib/supabase/server";
import type { Noticia } from "../types/News";

export async function buscarNoticiasPublicadas(): Promise<Noticia[]> {
  "use cache";

  cacheLife({
    stale: 60,
    revalidate: 60,
    expire: 3600,
  });

  cacheTag("noticias");

  const supabase = criarSupabaseServer();

  const { data, error } = await supabase
    .from("noticias")
    .select("id, slug, titulo, resumo, categoria, imagem_url, imagem_alt, autor, publicado_em")
    .eq("publicada", true)
    .order("publicado_em", { ascending: false })
    .limit(12);

  if (error) throw new Error("Não foi possível carregar as notícias.");
  return (data ?? []) as Noticia[];
}

export async function buscarNoticiaPorSlug(slug: string): Promise<Noticia | null> {
"use cache";

  cacheLife({
    stale: 300,
    revalidate: 300,
    expire: 86400,
  });

  cacheTag("noticias", `noticia:${slug}`);

  const supabase = criarSupabaseServer();
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("slug", slug)
    .eq("publicada", true)
    .maybeSingle();

  if (error) throw new Error("Não foi possível carregar a notícia.");
  return data as Noticia | null;
}
