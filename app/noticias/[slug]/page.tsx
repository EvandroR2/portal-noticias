import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { buscarNoticiaPorSlug } from "../../../services/newsService";

type PaginaNoticiaProps = { params: Promise<{ slug: string }> };


export default async function PaginaNoticia({ params }: PaginaNoticiaProps) {
  const { slug } = await params;
  const noticia = await buscarNoticiaPorSlug(slug);
  if (!noticia) notFound();

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
  ).replace(/\/$/, "");

  const urlNoticia = `${siteUrl}/noticias/${noticia.slug}`;

  const imagem =
    noticia.imagem_social_url ?? noticia.imagem_url;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.seo_descricao ?? noticia.resumo,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlNoticia,
    },
    url: urlNoticia,
    image: imagem ? [imagem] : undefined,
    datePublished: noticia.publicado_em,
    dateModified: noticia.atualizado_em,
    author: noticia.autor
      ? {
        "@type": "Person",
        name: noticia.autor,
      }
      : {
        "@type": "Organization",
        name: "Portal de Notícias",
      },
    publisher: {
      "@type": "Organization",
      name: "Portal de Notícias",
    },
    inLanguage: "pt-BR",
    isAccessibleForFree: true,
  };

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
    .format(new Date(noticia.publicado_em));

  return (
    <main className="news-details">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),

        }}
      />
      <article>
        <Link className="news-details__back" href="/">← Voltar às notícias</Link>
        {noticia.categoria && <span className="news-details__category">{noticia.categoria}</span>}
        <h1>{noticia.titulo}</h1>
        <p className="news-details__summary">{noticia.resumo}</p>
        <time dateTime={noticia.publicado_em}>Publicado em {dataFormatada}</time>
        {noticia.imagem_url && (
          <Image className="news-details__image" src={noticia.imagem_url}
            alt={noticia.imagem_alt ?? ""} width={1200} height={675} priority
            sizes="(max-width: 840px) 100vw, 800px" />
        )}
        <div className="news-details__content">{noticia.conteudo}</div>
      </article>
    </main>
  );
}

export async function generateMetadata({ params }: PaginaNoticiaProps): Promise<Metadata> {
  const { slug } = await params;
  const noticia = await buscarNoticiaPorSlug(slug);
  if (!noticia) return { title: "Notícia não encontrada" };

  const titulo = noticia.seo_titulo ?? noticia.titulo;
  const descricao = noticia.seo_descricao ?? noticia.resumo;
  const imagem = noticia.imagem_social_url ?? noticia.imagem_url;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/noticias/${noticia.slug}` },
    openGraph: {
      type: "article", title: titulo, description: descricao,
      publishedTime: noticia.publicado_em, modifiedTime: noticia.atualizado_em,
      authors: noticia.autor ? [noticia.autor] : undefined,
      images: imagem ? [{ url: imagem, alt: noticia.imagem_alt ?? noticia.titulo }] : undefined,
    },
  };
}
