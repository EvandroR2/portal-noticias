"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function sair() {
  const cookieStore = await cookies();

  cookieStore.delete("portal_token");
  cookieStore.delete("portal_nome");
  cookieStore.delete("portal_perfis");

  redirect("/login");
}
