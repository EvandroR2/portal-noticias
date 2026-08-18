import type { Noticia } from "../../types/News";
import { Link } from "react-router-dom";
import "./NewsCard.css";

type NewsCardProps = {
  noticia: Noticia;
};

function NewsCard({ noticia }: NewsCardProps) {
  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(noticia.criado_em));

  return (
  <article className="news-card">
    {noticia.imagem_url && (
      <img
        className="news-card__image"
        src={noticia.imagem_url}
        alt={`Imagem da notícia: ${noticia.titulo}`}
      />
    )}

    <div className="news-card__content">
      {noticia.categoria && (
        <span className="news-card__category">
          {noticia.categoria}
        </span>
      )}

      <h2>{noticia.titulo}</h2>

      <p>{noticia.resumo}</p>

      <time dateTime={noticia.criado_em}>
        {dataFormatada}
      </time>

      <Link
        className="news-card__link"
        to={`/noticias/${noticia.id}`}
      >
        Ler notícia
      </Link>
    </div>
  </article>
);
}

export default NewsCard;