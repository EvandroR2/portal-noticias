import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExternalImage from "../../../components/ExternalImage/ExternalImage";
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
    noticia.imagemSocialUrl ?? noticia.imagemUrl;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: noticia.titulo,
    description: noticia.seoDescricao ?? noticia.resumo,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": urlNoticia,
    },
    url: urlNoticia,
    image: imagem ? [imagem] : undefined,
    datePublished: noticia.publicadoEm,
    dateModified: noticia.atualizadoEm,
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
    .format(new Date(noticia.publicadoEm));

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
        <time dateTime={noticia.publicadoEm}>Publicado em {dataFormatada}</time>
        {noticia.imagemUrl && (
          <ExternalImage
            className="news-details__image"
            src={noticia.imagemUrl}
            alt={noticia.imagemAlt ?? ""}
            width={1200}
            height={675}
            priority
          />
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

  const titulo = noticia.seoTitulo ?? noticia.titulo;
  const descricao = noticia.seoDescricao ?? noticia.resumo;
  const imagem = noticia.imagemSocialUrl ?? noticia.imagemUrl;
  return {
    title: titulo,
    description: descricao,
    alternates: { canonical: `/noticias/${noticia.slug}` },
    openGraph: {
      type: "article", title: titulo, description: descricao,
      publishedTime: noticia.publicadoEm, modifiedTime: noticia.atualizadoEm,
      authors: noticia.autor ? [noticia.autor] : undefined,
      images: imagem ? [{ url: imagem, alt: noticia.imagemAlt ?? noticia.titulo }] : undefined,
    },
  };
}
