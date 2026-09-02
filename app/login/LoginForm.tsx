"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { criarSupabaseBrowser } from "../../lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    const supabase = criarSupabaseBrowser();

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error || !data.user) {
      setErro("E-mail ou senha inválidos.");
      setCarregando(false);
      return;
    }

    const { data: perfil, error: erroPerfil } = await supabase
      .from("profiles")
      .select("id, nome, funcao, ativo")
      .eq("id", data.user.id)
      .maybeSingle();

    if (erroPerfil || !perfil) {
      await supabase.auth.signOut();
      setErro("Não foi possível localizar seu perfil.");
      setCarregando(false);
      return;
    }

    if (!perfil.ativo) {
      await supabase.auth.signOut();
      setErro("Este usuário está desativado.");
      setCarregando(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <form className="login__form" onSubmit={entrar}>
      <div className="login__field">
        <label htmlFor="email">E-mail</label>

        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </div>

      <div className="login__field">
        <label htmlFor="senha">Senha</label>

        <input
          id="senha"
          name="senha"
          type="password"
          autoComplete="current-password"
          value={senha}
          onChange={(event) => setSenha(event.target.value)}
          required
        />
      </div>

      {erro && (
        <p className="login__error" role="alert">
          {erro}
        </p>
      )}

      <button
        className="login__button"
        type="submit"
        disabled={carregando}
      >
        {carregando ? "Entrando..." : "Entrar"}
      </button>
    </form>
  );
}