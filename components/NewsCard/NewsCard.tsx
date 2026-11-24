import Link from "next/link";
import type { NoticiaResumo } from "../../types/News";
import ExternalImage from "../ExternalImage/ExternalImage";
import "./NewsCard.css";

type NewsCardProps = { noticia: NoticiaResumo };

export default function NewsCard({ noticia }: NewsCardProps) {
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" })
    .format(new Date(noticia.publicadoEm));

  return (
    <article className="news-card">
      {noticia.imagemUrl && (
        <ExternalImage
          className="news-card__image"
          src={noticia.imagemUrl}
          alt={noticia.imagemAlt ?? ""}
          width={640}
          height={360}
        />
      )}
      <div className="news-card__content">
        {noticia.categoria && <span className="news-card__category">{noticia.categoria}</span>}
        <h2>{noticia.titulo}</h2>
        <p>{noticia.resumo}</p>
        <time dateTime={noticia.publicadoEm}>{dataFormatada}</time>
        <Link className="news-card__link" href={`/noticias/${noticia.slug}`}>
          Ler: {noticia.titulo}
        </Link>
      </div>
    </article>
  );
}
