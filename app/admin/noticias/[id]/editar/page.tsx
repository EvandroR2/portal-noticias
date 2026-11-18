import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import { connection } from "next/server";
import { obterNoticiaAdmin } from "@/services/adminNewsService";
import NoticiaForm from "../../nova/NoticiaForm";
import "../../nova/nova.css";

export const metadata: Metadata = {
  title: "Editar notícia",
  description: "Edite uma notícia cadastrada no portal.",
};

export const instant = false;

type EditarNoticiaPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditarNoticiaPage({
  params,
}: EditarNoticiaPageProps) {
  await connection();

  const { id: idTexto } = await params;
  const id = Number(idTexto);

  if (!Number.isInteger(id) || id <= 0) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;

  if (!token) {
    redirect("/login");
  }

  const resultado = await obterNoticiaAdmin(token, id);

  if (!resultado.sucesso) {
    if (resultado.status === 401) redirect("/login");
    if (resultado.status === 404) notFound();

    return (
      <main className="news-editor">
        <div className="news-editor__message" role="alert">
          <h1>Não foi possível abrir a notícia</h1>
          <p>{resultado.mensagem}</p>
          <Link href="/admin">Voltar ao painel</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="news-editor">
      <header className="news-editor__header">
        <span>Gerenciamento</span>
        <h1>Editar notícia</h1>
        <p>Atualize os dados ou altere o status de publicação.</p>
      </header>

      <NoticiaForm noticia={resultado.noticia} />
    </main>
  );
}
