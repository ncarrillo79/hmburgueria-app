import React, { useEffect, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../services/api";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);

  const fetchData = async () => {
    try {
      const data = await getPedidos();

      if (Array.isArray(data)) {
        setPedidos(data);
      } else {
        console.error("Error en datos:", data);
        setPedidos([]);
      }
    } catch (error) {
      console.error("Error fetch:", error);
      setPedidos([]);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const normalizar = (s) => (s || "").toLowerCase().trim();

  const nuevos = pedidos.filter(
    (p) => normalizar(p.status) === "novo" || normalizar(p.status) === "nuevo"
  );

  const preparando = pedidos.filter(
    (p) => normalizar(p.status) === "preparando"
  );

  const listos = pedidos.filter(
    (p) => normalizar(p.status) === "listo"
  );

  return (
    <div>
      <h1>📦 Pedidos na Cozinha</h1>

      <h2>🟡 Nuevos</h2>
      {nuevos.map((p) => (
        <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
      ))}

      <h2>🟠 Preparando</h2>
      {preparando.map((p) => (
        <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
      ))}

      <h2>🟢 Listos</h2>
      {listos.map((p) => (
        <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
      ))}
    </div>
  );
}

export default Cozinha;