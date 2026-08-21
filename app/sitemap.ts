import type { MetadataRoute } from "next";
import { buscarNoticiasPublicadas } from "../services/newsService";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const noticias = await buscarNoticiasPublicadas();
  return [
    { url: siteUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...noticias.map((noticia) => ({
      url: `${siteUrl}/noticias/${noticia.slug}`,
      lastModified: new Date(noticia.publicado_em),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
