import React from "react";
import toast from "react-hot-toast";
import { atualizarStatus, eliminarPedido } from "../services/api";

function PedidoCard({ pedido, onUpdate, isNew }) {

  const handleStatus = (status) => {
    toast((t) => (
      <div>
        <p>¿Cambiar estado del pedido?</p>

        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <button
            style={{ padding: "6px", cursor: "pointer" }}
            onClick={async () => {
              try {
                await atualizarStatus(pedido.numero, status);
                toast.dismiss(t.id);
                toast.success("Estado actualizado");
                onUpdate && onUpdate();
              } catch (error) {
                toast.error("Error al actualizar");
              }
            }}
          >
            Sí
          </button>

          <button
            style={{ padding: "6px", cursor: "pointer" }}
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
  };

  const handleDelete = () => {
    toast((t) => (
      <div>
        <p>¿Eliminar pedido?</p>

        <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
          <button
            style={{ padding: "6px", cursor: "pointer" }}
            onClick={async () => {
              try {
                await eliminarPedido(pedido.numero);
                toast.dismiss(t.id);
                toast.success("Pedido eliminado");
                onUpdate && onUpdate();
              } catch (error) {
                toast.error("Error al eliminar");
              }
            }}
          >
            Sí
          </button>

          <button
            style={{ padding: "6px", cursor: "pointer" }}
            onClick={() => toast.dismiss(t.id)}
          >
            No
          </button>
        </div>
      </div>
    ));
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
    <div className={`card ${statusClass} ${esUrgente ? "urgente" : ""} ${isNew ? "nuevo-highlight" : ""}`}>

      <div className="card-header">
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