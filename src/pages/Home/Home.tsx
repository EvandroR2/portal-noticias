import { useEffect, useState } from "react";
import NewsCard from "../../components/NewsCard/NewsCard";
import { buscarNoticiasPublicadas } from "../../services/newsService";
import type { Noticia } from "../../types/News";
import "./Home.css";

function Home() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function carregarNoticias() {
      try {
        const resultado = await buscarNoticiasPublicadas();
        setNoticias(resultado);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as notícias.";

        setErro(mensagem);
      } finally {
        setCarregando(false);
      }
    }

    carregarNoticias();
  }, []);

  return (
    <main className="home">
      <header className="home__header">
        <span>Informação e tecnologia</span>
        <h1>Portal de Notícias</h1>
        <p>
          Notícias, conteúdos e novidades reunidos em um só lugar.
        </p>
      </header>

      <section className="home__news">
        <h2>Últimas notícias</h2>

        {carregando && <p>Carregando notícias...</p>}

        {erro && (
          <p className="home__error">
            Erro ao carregar as notícias: {erro}
          </p>
        )}

        {!carregando && !erro && noticias.length === 0 && (
          <p>Nenhuma notícia publicada.</p>
        )}

        {!carregando && !erro && noticias.length > 0 && (
          <div className="home__grid">
            {noticias.map((noticia) => (
              <NewsCard
                key={noticia.id}
                noticia={noticia}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Home;