import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { obterApiUrl } from "@/lib/api";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mensagem: "Sua sessão expirou. Entre novamente." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const respostaApi = await fetch(`${obterApiUrl()}/api/Noticias/${id}`, {
      method: "PUT",
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

export async function DELETE(_request: Request, context: RouteContext) {
  const cookieStore = await cookies();
  const token = cookieStore.get("portal_token")?.value;

  if (!token) {
    return NextResponse.json(
      { mensagem: "Sua sessão expirou. Entre novamente." },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  try {
    const respostaApi = await fetch(`${obterApiUrl()}/api/Noticias/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
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
