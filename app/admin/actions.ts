"use server";

import { redirect } from "next/navigation";
import { criarSupabaseServer } from "../../lib/supabase/server";

export async function sair() {
  const supabase = await criarSupabaseServer();

  await supabase.auth.signOut();

  redirect("/login");
}