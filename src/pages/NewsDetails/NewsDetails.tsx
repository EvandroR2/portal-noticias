import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { buscarNoticiaPorId } from "../../services/newsService";
import type { Noticia } from "../../types/News";
import "./NewsDetails.css";

function NewsDetails() {
  const { id } = useParams();

  const [noticia, setNoticia] = useState<Noticia | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarNoticia() {
      if (!id) {
        setErro("Notícia não encontrada.");
        setCarregando(false);
        return;
      }

      try {
        const resultado = await buscarNoticiaPorId(id);
        setNoticia(resultado);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar a notícia.";

        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    }

    carregarNoticia();
  }, [id]);

  if (carregando) {
    return <p className="news-details__message">Carregando notícia...</p>;
  }

  if (erro) {
    return (
      <main className="news-details__message">
        <p>Erro ao carregar a notícia: {erro}</p>
        <Link to="/">Voltar ao início</Link>
      </main>
    );
  }

  if (!noticia) {
    return (
      <main className="news-details__message">
        <h1>Notícia não encontrada</h1>
        <Link to="/">Voltar ao início</Link>
      </main>
    );
  }

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "long",
  }).format(new Date(noticia.criado_em));

  return (
    <main className="news-details">
      <article>
        <Link className="news-details__back" to="/">
          ← Voltar às notícias
        </Link>

        {noticia.categoria && (
          <span className="news-details__category">
            {noticia.categoria}
          </span>
        )}

        <h1>{noticia.titulo}</h1>

        <p className="news-details__summary">
          {noticia.resumo}
        </p>

        <time dateTime={noticia.criado_em}>
          Publicado em {dataFormatada}
        </time>

        {noticia.imagem_url && (
          <img
            className="news-details__image"
            src={noticia.imagem_url}
            alt=""
          />
        )}

        <div className="news-details__content">
          {noticia.conteudo}
        </div>
      </article>
    </main>
  );
}

export default NewsDetails;