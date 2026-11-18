import { NextResponse } from "next/server";
import { obterApiUrl } from "@/lib/api";

type LoginResponse = {
  accessToken: string;
  tokenType: string;
  expiraEm: string;
  nome: string;
  email: string;
  perfis: string[];
};

export async function POST(request: Request) {
  const credenciais = await request.json();

  try {
    const respostaApi = await fetch(`${obterApiUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credenciais),
      cache: "no-store",
    });

    const dados = await respostaApi.json();

    if (!respostaApi.ok) {
      return NextResponse.json(dados, { status: respostaApi.status });
    }

    const login = dados as LoginResponse;
    const resposta = NextResponse.json({
      nome: login.nome,
      email: login.email,
      perfis: login.perfis,
    });

    const configuracaoCookie = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
      path: "/",
      expires: new Date(login.expiraEm),
    };

    resposta.cookies.set("portal_token", login.accessToken, configuracaoCookie);
    resposta.cookies.set("portal_nome", login.nome, configuracaoCookie);
    resposta.cookies.set(
      "portal_perfis",
      JSON.stringify(login.perfis),
      configuracaoCookie,
    );

    return resposta;
  } catch {
    return NextResponse.json(
      { mensagem: "Não foi possível conectar à API." },
      { status: 503 },
    );
  }
}
