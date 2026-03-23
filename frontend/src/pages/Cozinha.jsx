import React, { useEffect, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../services/api";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [hora, setHora] = useState("");

  const fetchData = async () => {
    try {
      const data = await getPedidos();

      if (Array.isArray(data)) {
        // 🔥 FILTRAR ELIMINADOS
        const visibles = data.filter(p => String(p.eliminado).toLowerCase() !== "true");
        setPedidos(visibles);
      } else {
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

  // ⏰ HORA EN VIVO
  useEffect(() => {
    const intervalHora = setInterval(() => {
      setHora(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(intervalHora);
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

  const cancelados = pedidos.filter(
    (p) => normalizar(p.status) === "cancelado"
  );

  return (
    <div className="cozinha-container">

      {/* HEADER */}
      <div className="header">
        <div className="header-content">
          <h1>🍔 Cocina</h1>
          <div className="header-info">
            <span>🕒 {hora}</span>
            <span>📦 {pedidos.length}</span>
          </div>
        </div>
      </div>

      {/* KANBAN */}
      <div className="kanban">

        <div className="column">
          <h2 className="col-title nuevos">🟡 Nuevos</h2>
          {nuevos.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

        <div className="column">
          <h2 className="col-title preparando">🟠 Preparando</h2>
          {preparando.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

        <div className="column">
          <h2 className="col-title listos">🟢 Listos</h2>
          {listos.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

        <div className="column">
          <h2 className="col-title cancelados">🔴 Cancelados</h2>
          {cancelados.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

      </div>

    </div>
  );
}

export default Cozinha;