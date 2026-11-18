import type { MetadataRoute } from "next";
import { buscarNoticiasPublicadas } from "../services/newsService";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const paginaInicial: MetadataRoute.Sitemap[number] = {
    url: siteUrl,
    lastModified: new Date(),
    changeFrequency: "daily",
    priority: 1,
  };

  try {
    const noticias = await buscarNoticiasPublicadas();

    return [
      paginaInicial,
      ...noticias.map((noticia) => ({
        url: `${siteUrl}/noticias/${noticia.slug}`,
        lastModified: new Date(noticia.publicadoEm),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    ];
  } catch {
    return [paginaInicial];
  }
}
