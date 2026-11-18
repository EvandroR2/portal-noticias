import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import NoticiaForm from "./NoticiaForm";
import "./nova.css";

export const metadata: Metadata = {
  title: "Nova notícia",
  description: "Cadastre uma nova notícia no portal.",
};

export const instant = false;

export default async function NovaNoticiaPage() {
  await connection();

  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;
  const nome = cookieStore.get("portal_nome")?.value;

  if (!token || !nome) {
    redirect("/login");
  }

  return (
    <main className="news-editor">
      <header className="news-editor__header">
        <span>Gerenciamento</span>
        <h1>Nova notícia</h1>
        <p>Preencha os dados e escolha se deseja publicar imediatamente.</p>
      </header>

      <NoticiaForm autorPadrao={nome} />
    </main>
  );
}
