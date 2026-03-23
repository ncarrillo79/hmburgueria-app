import React from "react";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate }) {

  const handleStatus = async (status) => {
    try {
      await atualizarStatus(pedido.numero, status);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async () => {
    try {
      await eliminarPedido(pedido.numero);

      // 🔥 IMPORTANTE: refrescar datos
      if (onUpdate) onUpdate();

    } catch (error) {
      console.error(error);
    }
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
        <p className="coment">{pedido.comentario}</p>
      )}

      <div className="status">{pedido.status}</div>

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