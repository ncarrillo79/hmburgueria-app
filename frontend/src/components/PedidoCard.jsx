import React from "react";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate }) {
  const handleStatus = async (status) => {
    try {
      await atualizarStatus(pedido.numero, status);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error actualizando pedido:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await eliminarPedido(pedido.numero);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error eliminando pedido:", error);
    }
  };

  const calcularTiempo = (hora, fecha) => {
    if (!hora || !fecha) return "";

    try {
      const ahora = new Date();
      const [dia, mes, anio] = fecha.split("/");
      const [h, m] = hora.split(":");

      const pedidoTime = new Date(`${anio}-${mes}-${dia}T${h}:${m}:00`);
      const diff = Math.floor((ahora - pedidoTime) / 60000);

      return diff < 0 ? "0 min" : `${diff} min`;
    } catch (error) {
      return "";
    }
  };

  const getStatusClass = () => {
    const s = (pedido.status || "").toLowerCase();

    if (s === "novo" || s === "nuevo") return "novo";
    if (s === "preparando") return "preparando";
    if (s === "listo") return "listo";
    if (s === "cancelado") return "cancelado";

    return "";
  };

  return (
    <div className={`card ${getStatusClass()}`}>
      <div className="card-top">
        <div className="pedido-id">Pedido #{pedido.numero}</div>

        <button
          className="trash-btn"
          onClick={handleDelete}
          title="Eliminar pedido"
          aria-label="Eliminar pedido"
        >
          <span className="trash-icon">🗑</span>
        </button>
      </div>

      <div className="card-content">
        <p><strong>Cliente:</strong> {pedido.cliente || "-"}</p>
        <p><strong>Descrição:</strong> {pedido.descricao || "-"}</p>
        <p><strong>Endereço:</strong> {pedido.endereco || "-"}</p>

        {pedido.comentario && (
          <p><strong>Observações:</strong> {pedido.comentario}</p>
        )}

        <p>
          <strong>Status:</strong>{" "}
          <span className={`status-badge ${getStatusClass()}`}>
            {pedido.status || "Novo"}
          </span>
        </p>

        {pedido.data && pedido.hora && (
          <p><strong>Recebido:</strong> {pedido.data} às {pedido.hora}</p>
        )}

        <p><strong>Tiempo:</strong> {calcularTiempo(pedido.hora, pedido.data)}</p>
      </div>

      <div className="actions">
        <button
          className="btn preparar"
          onClick={() => handleStatus("preparando")}
        >
          Preparar
        </button>

        <button
          className="btn listo"
          onClick={() => handleStatus("listo")}
        >
          Listo
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