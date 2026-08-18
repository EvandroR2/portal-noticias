import { supabase } from "../lib/supabase";
import type { Noticia } from "../types/News";

export async function buscarNoticiasPublicadas(): Promise<Noticia[]> {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("publicada", true)
    .order("criado_em", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function buscarNoticiaPorId(
  id: string
): Promise<Noticia | null> {
  const { data, error } = await supabase
    .from("noticias")
    .select("*")
    .eq("id", id)
    .eq("publicada", true)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}