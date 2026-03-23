import React from "react";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate }) {

  const handleStatus = async (status) => {
    const confirmacion = window.confirm("¿Seguro que deseas cambiar el estado?");
    if (!confirmacion) return;

    await atualizarStatus(pedido.numero, status);
    alert("✅ Estado actualizado");

    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    const confirmacion = window.confirm("¿Eliminar este pedido?");
    if (!confirmacion) return;

    await eliminarPedido(pedido.numero);
    alert("🗑 Pedido eliminado");

    if (onUpdate) onUpdate();
  };

  const statusClass = (pedido.status || "").toLowerCase();

  return (
    <div className={`card ${statusClass}`}>

      {/* HEADER CARD */}
      <div className="card-header">
        <span>Pedido #{pedido.numero}</span>

        <button className="trash-btn" onClick={handleDelete}>
          🗑️
        </button>
      </div>

      {/* BODY */}
      <div className="card-body">

        <p className="cliente">{pedido.cliente}</p>

        <p className="descripcion">{pedido.descricao}</p>

        <p className="direccion">{pedido.endereco}</p>

        {pedido.comentario && (
          <p className="comentario">📝 {pedido.comentario}</p>
        )}

      </div>

      {/* STATUS VISUAL */}
      <div className={`status-badge ${statusClass}`}>
        {pedido.status}
      </div>

      {/* BOTONES */}
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