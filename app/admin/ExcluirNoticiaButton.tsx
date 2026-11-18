"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ExcluirNoticiaButtonProps = {
  id: number;
  titulo: string;
};

export default function ExcluirNoticiaButton({
  id,
  titulo,
}: ExcluirNoticiaButtonProps) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [excluindo, setExcluindo] = useState(false);
  const [erro, setErro] = useState("");

  async function excluir() {
    setExcluindo(true);
    setErro("");

    try {
      const resposta = await fetch(`/api/admin/noticias/${id}`, {
        method: "DELETE",
      });

      if (resposta.status === 401) {
        router.replace("/login");
        return;
      }

      if (!resposta.ok) {
        const dados = await resposta.json().catch(() => null);
        setErro(dados?.mensagem ?? "Não foi possível excluir a notícia.");
        setExcluindo(false);
        return;
      }

      setConfirmando(false);
      router.refresh();
    } catch {
      setErro("Não foi possível conectar ao servidor.");
      setExcluindo(false);
    }
  }

  function cancelar() {
    if (excluindo) return;
    setErro("");
    setConfirmando(false);
  }

  return (
    <>
      <button
        className="admin__delete-button"
        type="button"
        onClick={() => setConfirmando(true)}
      >
        Excluir
      </button>

      {confirmando && (
        <div className="admin__dialog-backdrop">
          <div
            className="admin__dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby={`excluir-titulo-${id}`}
            aria-describedby={`excluir-descricao-${id}`}
          >
            <span>Exclusão definitiva</span>
            <h2 id={`excluir-titulo-${id}`}>Excluir esta notícia?</h2>
            <p id={`excluir-descricao-${id}`}>
              Você está prestes a excluir permanentemente:
            </p>
            <strong className="admin__dialog-news-title">“{titulo}”</strong>
            <p>Essa ação não poderá ser desfeita.</p>

            {erro && (
              <p className="admin__dialog-error" role="alert">
                {erro}
              </p>
            )}

            <div className="admin__dialog-actions">
              <button
                type="button"
                onClick={cancelar}
                disabled={excluindo}
              >
                Cancelar
              </button>
              <button
                className="admin__dialog-confirm"
                type="button"
                onClick={excluir}
                disabled={excluindo}
              >
                {excluindo ? "Excluindo..." : "Excluir definitivamente"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
