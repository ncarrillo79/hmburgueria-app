import React from "react";
import { atualizarStatus, eliminarPedido } from "../services/api";
import { imprimirPedido } from "../services/printer";

function PedidoCard({ pedido, onUpdate }) {
  const handleStatus = async (status) => {
    await atualizarStatus(pedido.numero, status);
    onUpdate();
  };

  const handleDelete = async () => {
    await eliminarPedido(pedido.numero);
    onUpdate();
  };

  return (
    <div className="card">
      <h3>Pedido #{pedido.numero}</h3>
      <p><strong>Cliente:</strong> {pedido.cliente}</p>
      <p><strong>Descrição:</strong> {pedido.descricao}</p>
      <p><strong>Endereço:</strong> {pedido.endereco}</p>

      {/* Observações do cliente */}
      {pedido.comentario && (
        <p><strong>Observações:</strong> {pedido.comentario}</p>
      )}

      {/* Status separado */}
      <p><strong>Status:</strong> {pedido.status || "Novo"}</p>

      {/* Data e hora */}
      {pedido.data && pedido.hora && (
        <p><strong>Recebido:</strong> {pedido.data} às {pedido.hora}</p>
      )}

      <div className="buttons">
        <button onClick={() => handleStatus("Em preparo")}>Em preparo</button>
        <button onClick={() => handleStatus("Enviado")}>Enviado</button>
        <button onClick={() => handleStatus("Cancelado")}>Cancelado</button>
        <button onClick={handleDelete}>Eliminar</button>
        <button onClick={() => imprimirPedido(pedido)}>PDF</button>
      </div>
    </div>
  );
}

export default PedidoCard;
