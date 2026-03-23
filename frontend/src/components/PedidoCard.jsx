import React from "react";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate }) {

  const handleStatus = async (status) => {
    const confirmacion = window.confirm("¿Cambiar estado del pedido?");
    if (!confirmacion) return;

    await atualizarStatus(pedido.numero, status);
    if (onUpdate) onUpdate();
  };

  const handleDelete = async () => {
    const confirmacion = window.confirm("¿Eliminar pedido?");
    if (!confirmacion) return;

    await eliminarPedido(pedido.numero);
    if (onUpdate) onUpdate();
  };

  const calcularTiempo = () => {
    if (!pedido.data || !pedido.hora) return 0;

    const fecha = pedido.data.split("/").reverse().join("-");
    const fechaCompleta = new Date(`${fecha}T${pedido.hora}`);

    const ahora = new Date();
    return Math.floor((ahora - fechaCompleta) / 60000);
  };

  const minutos = calcularTiempo();
  const esUrgente = minutos > 10;

  const statusClass = (pedido.status || "").toLowerCase();

  return (
    <div className={`card ${statusClass} ${esUrgente ? "urgente" : ""}`}>

      <div className="card-header">
        <span>Pedido #{pedido.numero}</span>

        <button className="trash-btn" onClick={handleDelete}>
          🗑️
        </button>
      </div>

      <div className="card-body">
        <p className="cliente">{pedido.cliente}</p>
        <p className="descripcion">{pedido.descricao}</p>
        <p className="direccion">{pedido.endereco}</p>

        {pedido.comentario && (
          <p className="comentario">📝 {pedido.comentario}</p>
        )}

        <p className={`tiempo ${esUrgente ? "urgente" : ""}`}>
          ⏱ {minutos} min
        </p>
      </div>

      <div className={`status-badge ${statusClass}`}>
        {pedido.status}
      </div>

      {/* 🔥 CONTENEDOR BOTONES CORREGIDO */}
      <div className="actions">
        <button className="btn preparar" onClick={() => handleStatus("preparando")}>
          Preparar
        </button>

        <button className="btn listo-btn" onClick={() => handleStatus("listo")}>
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