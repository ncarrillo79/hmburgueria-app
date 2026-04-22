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
                const resultado = await atualizarStatus(pedido.id, status);

                if (!resultado?.ok) {
                  toast.dismiss(t.id);
                  toast.error(resultado?.error || "No se pudo actualizar");
                  return;
                }

                toast.dismiss(t.id);
                toast.success("Estado actualizado");
                onUpdate && onUpdate();
              } catch (error) {
                toast.dismiss(t.id);
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
                const resultado = await eliminarPedido(pedido.id);

                if (!resultado?.ok) {
                  toast.dismiss(t.id);
                  toast.error(resultado?.error || "No se pudo eliminar");
                  return;
                }

                toast.dismiss(t.id);
                toast.success("Pedido eliminado");
                onUpdate && onUpdate();
              } catch (error) {
                toast.dismiss(t.id);
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
    if (!pedido.createdAt) return 0;

    const fechaCompleta = new Date(pedido.createdAt);
    if (isNaN(fechaCompleta.getTime())) return 0;

    const ahora = new Date();
    const diffMs = ahora - fechaCompleta;

    if (diffMs < 0) return 0;

    return Math.floor(diffMs / 60000);
  };

  const formatearHoraEntrada = () => {
    if (!pedido.createdAt) return "--:--";

    const fecha = new Date(pedido.createdAt);
    if (isNaN(fecha.getTime())) return "--:--";

    return fecha.toLocaleTimeString("es-AR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo"
    });
  };

  const minutos = calcularTiempo();
  const horaEntrada = formatearHoraEntrada();
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

        <div className={`tiempo-wrapper ${esUrgente ? "urgente" : ""}`}>
          <p className="hora-entrada">🕐 Entró a las {horaEntrada}</p>
          <p className={`tiempo ${esUrgente ? "urgente" : ""}`}>
            ⏱ Hace {minutos} min
          </p>
        </div>
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