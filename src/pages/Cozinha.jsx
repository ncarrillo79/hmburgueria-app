import React, { useEffect, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos, atualizarStatus, eliminarPedido } from "../services/api";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getPedidos();
      setPedidos(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h1>📦 Pedidos na Cozinha</h1>
      {pedidos.map((p) => (
        <PedidoCard
          key={p.numero}
          pedido={p}
          atualizarStatus={atualizarStatus}
          eliminarPedido={eliminarPedido}
        />
      ))}
    </div>
  );
}

export default Cozinha;
