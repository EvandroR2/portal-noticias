import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { criarSupabaseServer } from "../../lib/supabase/server";
import { sair } from "./actions";
import "./admin.css";

export const metadata: Metadata = {
  title: "Painel administrativo",
  description: "Gerenciamento das notícias do portal.",
};

// O painel depende da sessão armazenada em cookies e deve ser renderizado
// individualmente para cada requisição, nunca durante o prerender do build.
export const instant = false;

export default async function AdminPage() {
  const supabase = await criarSupabaseServer();

  const {
    data: { user },
    error: erroUsuario,
  } = await supabase.auth.getUser();

  if (erroUsuario || !user) {
    redirect("/login");
  }

  const { data: perfil, error: erroPerfil } = await supabase
    .from("profiles")
    .select("id, nome, funcao, ativo")
    .eq("id", user.id)
    .maybeSingle();

  if (erroPerfil || !perfil || !perfil.ativo) {
    await supabase.auth.signOut();
    redirect("/login");
  }

  return (
    <main className="admin">
      <header className="admin__header">
        <div>
          <span>Painel administrativo</span>
          <h1>Olá, {perfil.nome}</h1>
          <p>
            Você está conectado como{" "}
            <strong>{perfil.funcao}</strong>.
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

        <div className="admin__empty">
          <h3>Painel preparado</h3>
          <p>
            Na próxima etapa, vamos carregar as notícias cadastradas
            e adicionar as opções de edição e publicação.
          </p>
        </div>
      </section>
    </main>
  );
}
