import React, { useEffect, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../services/api";
import sonido from "../assets/notify.mp3";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const [ultimoTotal, setUltimoTotal] = useState(0);

  const fetchData = async () => {
    try {
      const data = await getPedidos();

      const visibles = (data || []).filter(
        (p) => String(p.eliminado).toLowerCase() !== "true"
      );

      // 🔔 sonido si llega nuevo pedido
      if (visibles.length > ultimoTotal) {
        const audio = new Audio(sonido);
        audio.play().catch(() => {});
      }

      setUltimoTotal(visibles.length);
      setPedidos(visibles);

    } catch (error) {
      console.error("Error fetch:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const normalizar = (s) => (s || "").toLowerCase().trim();

  const aplicarFiltro = (lista, estado) => {
    if (filtro === "todos") return lista;
    if (filtro === estado) return lista;
    return [];
  };

  const nuevos = pedidos.filter(p => normalizar(p.status) === "novo");
  const preparando = pedidos.filter(p => normalizar(p.status) === "preparando");
  const listos = pedidos.filter(p => normalizar(p.status) === "listo");
  const cancelados = pedidos.filter(p => normalizar(p.status) === "cancelado");

  return (
    <>
      {/* FILTROS */}
      <div className="filtros">
        <button onClick={() => setFiltro("todos")}>Todos</button>
        <button onClick={() => setFiltro("novo")}>Nuevos</button>
        <button onClick={() => setFiltro("preparando")}>Preparando</button>
        <button onClick={() => setFiltro("listo")}>Listos</button>
        <button onClick={() => setFiltro("cancelado")}>Cancelados</button>
      </div>

      {/* KANBAN */}
      <div className="kanban">

        <div className="column">
          <h2 className="col-title nuevos">🟡 Nuevos</h2>
          {aplicarFiltro(nuevos, "novo").map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

        <div className="column">
          <h2 className="col-title preparando">🟠 Preparando</h2>
          {aplicarFiltro(preparando, "preparando").map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

        <div className="column">
          <h2 className="col-title listos">🟢 Listos</h2>
          {aplicarFiltro(listos, "listo").map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

        <div className="column">
          <h2 className="col-title cancelados">🔴 Cancelados</h2>
          {aplicarFiltro(cancelados, "cancelado").map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
        </div>

      </div>
    </>
  );
}

export default Cozinha;