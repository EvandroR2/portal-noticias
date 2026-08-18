import { useEffect, useState } from "react";
import { supabase } from "./lib/supabase";

type Noticia = {
  id: number;
  titulo: string;
  resumo: string;
  conteudo: string;
  categoria: string | null;
  imagem_url: string | null;
  publicada: boolean;
  criado_em: string;
};

function App() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarNoticias() {
      const { data, error } = await supabase
        .from("noticias")
        .select("*")
        .eq("publicada", true)
        .order("criado_em", { ascending: false });

      if (error) {
        setErro(error.message);
      } else {
        setNoticias(data ?? []);
      }

      setCarregando(false);
    }

    buscarNoticias();
  }, []);

  if (carregando) {
    return <p>Carregando notícias...</p>;
  }

  if (erro) {
    return <p>Erro ao carregar as notícias: {erro}</p>;
  }

  return (
    <main>
      <h1>Portal de Notícias</h1>

      {noticias.length === 0 ? (
        <p>Nenhuma notícia publicada.</p>
      ) : (
        noticias.map((noticia) => (
          <article key={noticia.id}>
            <span>{noticia.categoria}</span>
            <h2>{noticia.titulo}</h2>
            <p>{noticia.resumo}</p>
          </article>
        ))
      )}
    </main>
  );
}

export default App;