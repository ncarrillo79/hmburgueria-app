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
        setPedidos(data);
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
      const ahora = new Date();
      setHora(ahora.toLocaleTimeString());
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
          <h1>🍔 Sistema de Cocina</h1>

          <div className="header-info">
            <span>🕒 {hora}</span>
            <span>📦 {pedidos.length} pedidos</span>
          </div>
        </div>
      </div>

      {/* NUEVOS */}
      <div className="section">
        <h2 className="section-title nuevos">🟡 Nuevos</h2>
        {nuevos.length === 0 ? (
          <p className="empty">Sin pedidos nuevos</p>
        ) : (
          nuevos.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))
        )}
      </div>

      {/* PREPARANDO */}
      <div className="section">
        <h2 className="section-title preparando">🟠 Preparando</h2>
        {preparando.length === 0 ? (
          <p className="empty">Sin pedidos en preparación</p>
        ) : (
          preparando.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))
        )}
      </div>

      {/* LISTOS */}
      <div className="section">
        <h2 className="section-title listos">🟢 Listos</h2>
        {listos.length === 0 ? (
          <p className="empty">Sin pedidos listos</p>
        ) : (
          listos.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))
        )}
      </div>

      {/* CANCELADOS */}
      <div className="section">
        <h2 className="section-title cancelados">🔴 Cancelados</h2>
        {cancelados.length === 0 ? (
          <p className="empty">Sin pedidos cancelados</p>
        ) : (
          cancelados.map((p) => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))
        )}
      </div>

    </div>
  );
}

export default Cozinha;