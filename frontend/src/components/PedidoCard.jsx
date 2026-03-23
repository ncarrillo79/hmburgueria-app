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

  const getStatusColor = () => {
    const s = (pedido.status || "").toLowerCase();

    if (s === "novo" || s === "nuevo") return "#facc15";
    if (s === "preparando") return "#fb923c";
    if (s === "listo") return "#4ade80";
    if (s === "cancelado") return "#f87171";

    return "#999";
  };

  return (
    <div className="card" style={{ borderLeft: `6px solid ${getStatusColor()}` }}>
      <h3>Pedido #{pedido.numero}</h3>

      <p><strong>Cliente:</strong> {pedido.cliente || "-"}</p>
      <p><strong>Descrição:</strong> {pedido.descricao || "-"}</p>
      <p><strong>Endereço:</strong> {pedido.endereco || "-"}</p>

      {pedido.comentario && (
        <p><strong>Observações:</strong> {pedido.comentario}</p>
      )}

      <p>
        <strong>Status:</strong>{" "}
        <span style={{ color: getStatusColor(), fontWeight: "bold" }}>
          {pedido.status || "Novo"}
        </span>
      </p>

      {pedido.data && pedido.hora && (
        <p><strong>Recebido:</strong> {pedido.data} às {pedido.hora}</p>
      )}

      <p><strong>Tiempo:</strong> {calcularTiempo(pedido.hora, pedido.data)}</p>

      <div className="buttons">
        <button onClick={() => handleStatus("preparando")}>Preparar</button>
        <button onClick={() => handleStatus("listo")}>Listo</button>
        <button onClick={() => handleStatus("cancelado")}>Cancelar</button>
        <button onClick={handleDelete}>Eliminar</button>
      </div>
    </div>
  );
}

export default PedidoCard;