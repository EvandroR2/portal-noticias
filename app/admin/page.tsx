import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import { listarNoticiasAdmin } from "@/services/adminNewsService";
import { sair } from "./actions";
import ExcluirNoticiaButton from "./ExcluirNoticiaButton";
import "./admin.css";

export const metadata: Metadata = {
  title: "Painel administrativo",
  description: "Gerenciamento das notícias do portal.",
};

// O painel depende da sessão armazenada em cookies e deve ser renderizado
// individualmente para cada requisição, nunca durante o prerender do build.
export const instant = false;

function formatarData(data: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "America/Sao_Paulo",
  }).format(new Date(data));
}

export default async function AdminPage() {
  await connection();

  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;
  const nome = cookieStore.get("portal_nome")?.value;
  const perfisCookie = cookieStore.get("portal_perfis")?.value;

  if (!token || !nome || !perfisCookie) {
    redirect("/login");
  }

  let perfis: string[] = [];

  try {
    perfis = JSON.parse(perfisCookie);
  } catch {
    redirect("/login");
  }

  const resultadoNoticias = await listarNoticiasAdmin(token);

  if (!resultadoNoticias.sucesso && resultadoNoticias.status === 401) {
    redirect("/login");
  }

  return (
    <main className="admin">
      <header className="admin__header">
        <div>
          <span>Painel administrativo</span>
          <h1>Olá, {nome}</h1>
          <p>
            Você está conectado como{" "}
            <strong>{perfis.join(", ")}</strong>.
          </p>
        </div>

        <form action={sair}>
          <button className="admin__logout" type="submit">
            Sair
          </button>
        </form>
      </header>

      <section className="admin__content">
        <div className="admin__section-heading">
          <div>
            <span>Gerenciamento</span>
            <h2>Notícias cadastradas</h2>
          </div>

          <Link
            className="admin__new-button"
            href="/admin/noticias/nova"
          >
            Nova notícia
          </Link>
        </div>

        {!resultadoNoticias.sucesso ? (
          <div className="admin__message admin__message--error" role="alert">
            <h3>Não foi possível carregar o painel</h3>
            <p>{resultadoNoticias.mensagem}</p>
          </div>
        ) : resultadoNoticias.noticias.length === 0 ? (
          <div className="admin__message">
            <h3>Nenhuma notícia cadastrada</h3>
            <p>Use o botão “Nova notícia” para fazer o primeiro cadastro.</p>
          </div>
        ) : (
          <div className="admin__news-list">
            {resultadoNoticias.noticias.map((noticia) => (
              <article className="admin__news-card" key={noticia.id}>
                <div className="admin__news-main">
                  <div className="admin__news-meta">
                    <span
                      className={`admin__status ${
                        noticia.publicada
                          ? "admin__status--published"
                          : "admin__status--draft"
                      }`}
                    >
                      {noticia.publicada ? "Publicada" : "Rascunho"}
                    </span>

                    <span>{noticia.categoria || "Sem categoria"}</span>
                  </div>

                  <h3>{noticia.titulo}</h3>

                  <p>
                    {noticia.autor
                      ? `Por ${noticia.autor}`
                      : "Autor não informado"}
                  </p>
                </div>

                <div className="admin__news-actions">
                  <div className="admin__news-dates">
                    <span>Atualizada</span>
                    <strong>{formatarData(noticia.atualizadoEm)}</strong>
                  </div>

                  <Link
                    className="admin__edit-button"
                    href={`/admin/noticias/${noticia.id}/editar`}
                  >
                    Editar
                  </Link>

                  <ExcluirNoticiaButton
                    id={noticia.id}
                    titulo={noticia.titulo}
                  />
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
