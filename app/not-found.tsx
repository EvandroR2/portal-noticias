import Link from "next/link";

export default function NotFound() {
  return (
    <main className="status-page">
      <h1>Notícia não encontrada</h1>
      <p>A página procurada não existe ou não está publicada.</p>
      <Link href="/">Voltar ao início</Link>
    </main>
  );
}
