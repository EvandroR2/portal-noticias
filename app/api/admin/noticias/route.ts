import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { obterApiUrl } from "@/lib/api";

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mensagem: "Sua sessão expirou. Entre novamente." },
      { status: 401 },
    );
  }

  try {
    const respostaApi = await fetch(`${obterApiUrl()}/api/Noticias`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: await request.text(),
      cache: "no-store",
    });

    const conteudo = await respostaApi.text();

    return new NextResponse(conteudo || null, {
      status: respostaApi.status,
      headers: conteudo
        ? { "Content-Type": "application/json; charset=utf-8" }
        : undefined,
    });
  } catch {
    return NextResponse.json(
      { mensagem: "A API de notícias não está disponível no momento." },
      { status: 503 },
    );
  }
}
