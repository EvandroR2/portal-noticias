import Image from "next/image";
import Link from "next/link";
import type { Noticia } from "../../types/News";
import "./NewsCard.css";

type NewsCardProps = { noticia: Noticia };

export default function NewsCard({ noticia }: NewsCardProps) {
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
    .format(new Date(noticia.publicado_em));

  return (
    <article className="news-card">
      {noticia.imagem_url && (
        <Image className="news-card__image" src={noticia.imagem_url}
          alt={noticia.imagem_alt ?? ""} width={640} height={360}
          sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw" />
      )}
      <div className="news-card__content">
        {noticia.categoria && <span className="news-card__category">{noticia.categoria}</span>}
        <h2>{noticia.titulo}</h2>
        <p>{noticia.resumo}</p>
        <time dateTime={noticia.publicado_em}>{dataFormatada}</time>
        <Link className="news-card__link" href={`/noticias/${noticia.slug}`}>
          Ler: {noticia.titulo}
        </Link>
      </div>
    </article>
  );
}
