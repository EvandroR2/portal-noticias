"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

type NoticiaFormProps = {
  autorPadrao?: string;
  noticia?: {
    id: number;
    titulo: string;
    resumo: string;
    conteudo: string;
    categoria: string | null;
    imagemUrl: string | null;
    imagemAlt: string | null;
    autor: string | null;
    fonteUrl: string | null;
    publicada: boolean;
    seoTitulo: string | null;
    seoDescricao: string | null;
    imagemSocialUrl: string | null;
  };
};

function valorOpcional(formData: FormData, campo: string) {
  const valor = formData.get(campo)?.toString().trim();
  return valor || null;
}

function obterMensagemErro(dados: unknown) {
  if (!dados || typeof dados !== "object") {
    return "Não foi possível cadastrar a notícia.";
  }

  const resposta = dados as {
    mensagem?: string;
    errors?: Record<string, string[]>;
  };

  if (resposta.mensagem) return resposta.mensagem;

  const primeiroErro = resposta.errors
    ? Object.values(resposta.errors).flat()[0]
    : undefined;

  return primeiroErro || "Não foi possível cadastrar a notícia.";
}

export default function NoticiaForm({
  autorPadrao,
  noticia: noticiaExistente,
}: NoticiaFormProps) {
  const router = useRouter();
  const [erro, setErro] = useState("");
  const [salvando, setSalvando] = useState(false);
  const editando = Boolean(noticiaExistente);

  async function cadastrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setSalvando(true);

    const formData = new FormData(event.currentTarget);

    const noticia = {
      titulo: formData.get("titulo")?.toString().trim(),
      resumo: formData.get("resumo")?.toString().trim(),
      conteudo: formData.get("conteudo")?.toString().trim(),
      categoria: valorOpcional(formData, "categoria"),
      imagemUrl: valorOpcional(formData, "imagemUrl"),
      imagemAlt: valorOpcional(formData, "imagemAlt"),
      autor: valorOpcional(formData, "autor"),
      fonteUrl: valorOpcional(formData, "fonteUrl"),
      publicada: formData.get("publicada") === "on",
      seoTitulo: valorOpcional(formData, "seoTitulo"),
      seoDescricao: valorOpcional(formData, "seoDescricao"),
      imagemSocialUrl: valorOpcional(formData, "imagemSocialUrl"),
    };

    try {
      const endpoint = editando
        ? `/api/admin/noticias/${noticiaExistente!.id}`
        : "/api/admin/noticias";

      const resposta = await fetch(endpoint, {
        method: editando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(noticia),
      });

      if (!resposta.ok) {
        if (resposta.status === 401) {
          router.replace("/login");
          return;
        }

        const dados = await resposta.json().catch(() => null);
        setErro(obterMensagemErro(dados));
        setSalvando(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
      setSalvando(false);
    }
  }

  return (
    <form className="news-form" onSubmit={cadastrar}>
      <section className="news-form__section">
        <div className="news-form__section-heading">
          <h2>Conteúdo principal</h2>
          <p>Informações exibidas na página da notícia.</p>
        </div>

        <div className="news-form__fields">
          <label className="news-form__field news-form__field--full">
            <span>Título *</span>
            <input
              name="titulo"
              required
              maxLength={200}
              defaultValue={noticiaExistente?.titulo}
            />
          </label>

          <label className="news-form__field news-form__field--full">
            <span>Resumo *</span>
            <textarea
              name="resumo"
              required
              rows={3}
              maxLength={500}
              defaultValue={noticiaExistente?.resumo}
            />
          </label>

          <label className="news-form__field news-form__field--full">
            <span>Conteúdo *</span>
            <textarea
              name="conteudo"
              required
              rows={10}
              defaultValue={noticiaExistente?.conteudo}
            />
          </label>

          <label className="news-form__field">
            <span>Categoria</span>
            <input
              name="categoria"
              placeholder="Ex.: Tecnologia"
              defaultValue={noticiaExistente?.categoria ?? ""}
            />
          </label>

          <label className="news-form__field">
            <span>Autor</span>
            <input
              name="autor"
              defaultValue={noticiaExistente?.autor ?? autorPadrao ?? ""}
            />
          </label>

          <label className="news-form__field news-form__field--full">
            <span>URL da fonte</span>
            <input
              name="fonteUrl"
              type="url"
              placeholder="https://..."
              defaultValue={noticiaExistente?.fonteUrl ?? ""}
            />
          </label>
        </div>
      </section>

      <section className="news-form__section">
        <div className="news-form__section-heading">
          <h2>Imagem</h2>
          <p>Imagem principal e descrição para acessibilidade.</p>
        </div>

        <div className="news-form__fields">
          <label className="news-form__field news-form__field--full">
            <span>URL da imagem</span>
            <input
              name="imagemUrl"
              type="url"
              placeholder="https://..."
              defaultValue={noticiaExistente?.imagemUrl ?? ""}
            />
          </label>

          <label className="news-form__field news-form__field--full">
            <span>Texto alternativo</span>
            <input
              name="imagemAlt"
              placeholder="Descreva brevemente a imagem"
              defaultValue={noticiaExistente?.imagemAlt ?? ""}
            />
          </label>
        </div>
      </section>

      <section className="news-form__section">
        <div className="news-form__section-heading">
          <h2>SEO</h2>
          <p>Campos opcionais para mecanismos de busca e redes sociais.</p>
        </div>

        <div className="news-form__fields">
          <label className="news-form__field news-form__field--full">
            <span>Título para SEO</span>
            <input
              name="seoTitulo"
              maxLength={200}
              defaultValue={noticiaExistente?.seoTitulo ?? ""}
            />
          </label>

          <label className="news-form__field news-form__field--full">
            <span>Descrição para SEO</span>
            <textarea
              name="seoDescricao"
              rows={3}
              maxLength={500}
              defaultValue={noticiaExistente?.seoDescricao ?? ""}
            />
          </label>

          <label className="news-form__field news-form__field--full">
            <span>URL da imagem social</span>
            <input
              name="imagemSocialUrl"
              type="url"
              placeholder="https://..."
              defaultValue={noticiaExistente?.imagemSocialUrl ?? ""}
            />
          </label>
        </div>
      </section>

      <label className="news-form__publish">
        <input
          name="publicada"
          type="checkbox"
          defaultChecked={noticiaExistente?.publicada}
        />
        <span>
          <strong>Publicar notícia</strong>
          <small>Desmarcada, ela será salva como rascunho.</small>
        </span>
      </label>

      {erro && (
        <p className="news-form__error" role="alert">
          {erro}
        </p>
      )}

      <div className="news-form__actions">
        <Link className="news-form__cancel" href="/admin">
          Cancelar
        </Link>

        <button type="submit" disabled={salvando}>
          {salvando
            ? "Salvando..."
            : editando
              ? "Salvar alterações"
              : "Salvar notícia"}
        </button>
      </div>
    </form>
  );
}
