import NewsCard from "../components/NewsCard/NewsCard";
import { buscarNoticiasPublicadas } from "../services/newsService";

export const dynamic = "force-dynamic";

export default async function Home() {
  const noticias = await buscarNoticiasPublicadas();
  return (
    <main className="home">
      <header className="home__header">
        <span>Informação e tecnologia</span>
        <h1>Portal de Notícias</h1>
        <p>Notícias, conteúdos e novidades reunidos em um só lugar.</p>
      </header>
      <section className="home__news" aria-labelledby="ultimas-noticias">
        <h2 id="ultimas-noticias">Últimas notícias</h2>
        {noticias.length === 0 ? <p>Nenhuma notícia publicada.</p> : (
          <div className="home__grid">
            {noticias.map((noticia) => <NewsCard key={noticia.id} noticia={noticia} />)}
          </div>
        )}
      </section>
    </main>
  );
}
