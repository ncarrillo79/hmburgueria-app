import React from "react";
import toast from "react-hot-toast";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate, isNew }) {
  const handleStatus = async (status) => {
    const confirmacion = window.confirm("Alterar status do pedido?");
    if (!confirmacion) return;

    try {
      await atualizarStatus(pedido.numero, status);
      toast.success("Status atualizado");

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível atualizar o status");
    }
  };

  const handleDelete = async () => {
    const confirmacion = window.confirm("Eliminar pedido?");
    if (!confirmacion) return;

    try {
      await eliminarPedido(pedido.numero);
      toast.success("Pedido eliminado");

      if (onUpdate) onUpdate();
    } catch (error) {
      console.error(error);
      toast.error("Não foi possível eliminar o pedido");
    }
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
    <div
      className={`card ${statusClass} ${esUrgente ? "urgente" : ""} ${
        isNew ? "nuevo-highlight" : ""
      }`}
    >
      <div className="card-header">queda cada uno Cozinha.jsx Pedidos.jsx y PedidosCard.jsx
        
        <span>Pedido #{pedido.numero}</span>

        <button className="trash-btn" onClick={handleDelete} title="Eliminar">
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

      <div className="actions">
        <button
          className="btn preparar"
          onClick={() => handleStatus("preparando")}
        >
          Preparar
        </button>

        <button
          className="btn listo-btn"
          onClick={() => handleStatus("listo")}
        >
          Pronto
        </button>

        <button
          className="btn cancelar"
          onClick={() => handleStatus("cancelado")}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default PedidoCard;