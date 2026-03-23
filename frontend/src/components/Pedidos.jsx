import React, { useEffect, useState } from "react";
import { getPedidos } from "../services/api";
import PedidoCard from "./PedidoCard";

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);

  // Cargar pedidos desde la API
  const carregarPedidos = async () => {
    const data = await getPedidos();
    setPedidos(data);
  };

  // Cargar al montar el componente
  useEffect(() => {
    carregarPedidos();
  }, []);

  return (
    <div>
      <h2>Lista de Pedidos</h2>
      {pedidos.length === 0 ? (
        <p>No hay pedidos aún.</p>
      ) : (
        pedidos.map((pedido) => (
          <PedidoCard
            key={pedido.numero}
            pedido={pedido}
            onUpdate={carregarPedidos} // refresca lista al cambiar status
          />
        ))
      )}
    </div>
  );
}

export default Pedidos;
