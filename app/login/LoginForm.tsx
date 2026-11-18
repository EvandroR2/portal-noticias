"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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

    try {
      const resposta = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => null);
        setErro(dados?.mensagem ?? "E-mail ou senha inválidos.");
        setCarregando(false);
        return;
      }
    } catch {
      setErro("Não foi possível conectar ao servidor.");
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
