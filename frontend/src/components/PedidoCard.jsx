import React from "react";
import toast from "react-hot-toast";
import { atualizarStatus, eliminarPedido } from "../services/api";

function confirmar(mensagem, onSim) {
  toast((t) => (
    <div className="toast-confirm">
      <p className="toast-msg">{mensagem}</p>
      <div className="toast-actions">
        <button
          className="toast-btn toast-sim"
          onClick={async () => {
            toast.dismiss(t.id);
            await onSim();
          }}
        >
          Sim
        </button>
        <button
          className="toast-btn toast-nao"
          onClick={() => toast.dismiss(t.id)}
        >
          Não
        </button>
      </div>
    </div>
  ), { duration: 8000 });
}

function PedidoCard({ pedido, onUpdate, isNew }) {

  const handleStatus = (status) => {
    confirmar(`Alterar para "${status}"?`, async () => {
      try {
        const res = await atualizarStatus(pedido.id, status);
        if (!res?.ok) {
          toast.error(res?.error || "Não foi possível atualizar");
          return;
        }
        toast.success("Status atualizado");
        onUpdate?.();
      } catch {
        toast.error("Erro ao atualizar");
      }
    });
  };

  const handleDelete = () => {
    confirmar("Eliminar este pedido?", async () => {
      try {
        const res = await eliminarPedido(pedido.id);
        if (!res?.ok) {
          toast.error(res?.error || "Não foi possível eliminar");
          return;
        }
        toast.success("Pedido eliminado");
        onUpdate?.();
      } catch {
        toast.error("Erro ao eliminar");
      }
    });
  };

  const calcularMinutos = () => {
    if (!pedido.createdAt) return 0;
    const t = new Date(pedido.createdAt);
    if (isNaN(t)) return 0;
    return Math.max(0, Math.floor((Date.now() - t) / 60000));
  };

  const formatarHora = () => {
    if (!pedido.createdAt) return "--:--";
    const t = new Date(pedido.createdAt);
    if (isNaN(t)) return "--:--";
    return t.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "America/Sao_Paulo",
    });
  };

  const minutos    = calcularMinutos();
  const horaEntrada = formatarHora();
  const esUrgente  = minutos > 10;
  const statusCls  = (pedido.status || "").toLowerCase();

  // Parsear ítems del pedido: dividir por newline o coma
  const items = (pedido.descricao || "")
    .split(/\n|,/)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className={`card ${statusCls} ${esUrgente ? "urgente" : ""} ${isNew ? "nuevo-highlight" : ""}`}>

      {/* ── HEADER ── */}
      <div className="card-header">
        <span className="card-order-num">#{pedido.numero}</span>
        <div className="card-header-right">
          <span className={`card-time-badge ${esUrgente ? "urgente" : ""}`}>
            {esUrgente ? "🔥" : "⏱"} {minutos} min
          </span>
          <button className="trash-btn" onClick={handleDelete} title="Eliminar pedido">
            ✕
          </button>
        </div>
      </div>

      {/* ── CLIENTE ── */}
      <div className="card-cliente">{pedido.cliente}</div>

      <div className="card-divider" />

      {/* ── ÍTEMS ── */}
      {items.length > 0 && (
        <ul className="card-items">
          {items.map((item, i) => (
            <li key={i} className="card-item">{item}</li>
          ))}
        </ul>
      )}

      {/* ── META (dirección, bairro, taxa) ── */}
      <div className="card-meta">
        {pedido.endereco && (
          <div className="card-meta-row">
            <span className="card-meta-icon">📍</span>
            <span className="card-meta-text">{pedido.endereco}</span>
          </div>
        )}
        {pedido.bairro && (
          <div className="card-meta-row">
            <span className="card-meta-icon">🏘</span>
            <span className="card-meta-text">{pedido.bairro}</span>
          </div>
        )}
        {pedido.taxa != null && pedido.taxa !== "" && (
          <div className="card-meta-row">
            <span className="card-meta-icon">🛵</span>
            <span className="card-meta-text">Taxa: R$ {Number(pedido.taxa).toFixed(2)}</span>
          </div>
        )}
      </div>

      {/* ── COMENTÁRIO ── */}
      {pedido.comentario && (
        <div className="card-comment">
          <span>📝</span>
          <span>{pedido.comentario}</span>
        </div>
      )}

      {/* ── HORA ENTRADA ── */}
      <div className="card-hora">🕐 Entrou às {horaEntrada}</div>

      {/* ── ACTIONS ── */}
      <div className="actions">
        <button className="btn preparar" onClick={() => handleStatus("preparando")}>
          Preparar
        </button>
        <button className="btn listo-btn" onClick={() => handleStatus("listo")}>
          Pronto ✓
        </button>
        <button className="btn cancelar" onClick={() => handleStatus("cancelado")}>
          Cancelar
        </button>
      </div>

    </div>
  );
}

export default PedidoCard;
