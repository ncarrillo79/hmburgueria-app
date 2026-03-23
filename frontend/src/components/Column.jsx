import React from "react";
import PedidoCard from "./PedidoCard";

function Column({ title, pedidos, color, onUpdate }) {
  return (
    <div className="column">
      <h2 style={{ color }}>{title}</h2>

      {pedidos.map((p) => (
        <PedidoCard
          key={p.numero}
          pedido={p}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}

export default Column;