import React from "react";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate }) {

  const handleStatus = async (status) => {
    await atualizarStatus(pedido.numero, status);
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    console.log("🗑 Eliminando pedido:", pedido.numero);

    await eliminarPedido(pedido.numero);

    // 🔥 FORZAR REFRESH
    setTimeout(() => {
      if (onUpdate) onUpdate();
    }, 500);
  };

  return (
    <div className="card">

      <div className="card-top">
        <strong>#{pedido.numero}</strong>

        <button className="trash-btn" onClick={handleDelete}>
          🗑
        </button>
      </div>

      <p><strong>{pedido.cliente || "-"}</strong></p>
      <p>{pedido.descricao || "-"}</p>
      <p>{pedido.endereco || "-"}</p>

      {pedido.comentario && (
        <p>{pedido.comentario}</p>
      )}

      <p><strong>{pedido.status}</strong></p>

      <div className="actions">
        <button className="btn preparar" onClick={() => handleStatus("preparando")}>
          Preparar
        </button>

        <button className="btn listo" onClick={() => handleStatus("listo")}>
          Listo
        </button>

        <button className="btn cancelar" onClick={() => handleStatus("cancelado")}>
          Cancelar
        </button>
      </div>

    </div>
  );
}

export default PedidoCard;