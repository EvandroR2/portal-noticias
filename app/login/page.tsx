import type { Metadata } from "next";
import LoginForm from "./LoginForm";
import "./login.css";

export const metadata: Metadata = {
  title: "Acessar",
  description: "Acesse o painel administrativo do portal.",
};

export default function LoginPage() {
  return (
    <main className="login">
      <section className="login__card">
        <div className="login__heading">
          <span>Área administrativa</span>
          <h1>Acessar o portal</h1>
          <p>Informe seu e-mail e senha para continuar.</p>
        </div>

        <LoginForm />
      </section>
    </main>
  );
}