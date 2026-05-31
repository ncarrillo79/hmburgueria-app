import React, { useEffect, useRef, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../services/api";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");

  // 🔥 useRef → SIEMPRE actualizado (para detectar pedidos nuevos)
  const idsPreviosRef = useRef([]);

  const audioRef = useRef(null);

  // 🔓 desbloquear audio con interacción
  useEffect(() => {
    audioRef.current = new Audio("/notify.mp3");

    const unlockAudio = () => {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});

      window.removeEventListener("click", unlockAudio);
    };

    window.addEventListener("click", unlockAudio);

    return () => window.removeEventListener("click", unlockAudio);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPedidos();

      const visibles = (data || []).filter(
        (p) => String(p.eliminado).toLowerCase() !== "true"
      );

      // 🔥 usar pedido.id (UUID) en vez de numero
      const idsActuales = visibles.map(p => p.id);

      const nuevos = idsActuales.filter(
        id => !idsPreviosRef.current.includes(id)
      );

      // 🔔 SOLO SI HAY NUEVOS
      if (nuevos.length > 0 && idsPreviosRef.current.length > 0) {
        console.log("🔔 NUEVO PEDIDO:", nuevos);

        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      idsPreviosRef.current = idsActuales;

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

  // 🔥 contadores por estado (se recalculan automáticamente cuando cambia pedidos)
  const contadores = {
    todos:      pedidos.length,
    novo:       pedidos.filter(p => normalizar(p.status) === "novo").length,
    preparando: pedidos.filter(p => normalizar(p.status) === "preparando").length,
    listo:      pedidos.filter(p => normalizar(p.status) === "listo").length,
    cancelado:  pedidos.filter(p => normalizar(p.status) === "cancelado").length,
  };

  // 🔥 definición de los botones de filtro (fuente única de verdad)
  const botonesFiltro = [
    { key: "todos",      label: "Todos",      icono: "📋" },
    { key: "novo",       label: "Novos",      icono: "🟡" },
    { key: "preparando", label: "Preparando", icono: "🟠" },
    { key: "listo",      label: "Prontos",    icono: "🟢" },
    { key: "cancelado",  label: "Cancelados", icono: "🔴" },
  ];

  // 🔥 helper: decide si una columna debe mostrarse según el filtro activo
  const mostrarColumna = (estado) => filtro === "todos" || filtro === estado;

  return (
    <div>

      {/* 🔽 BARRA DE FILTRO CON BOTONES */}
      <div className="filtro-bar">
        {botonesFiltro.map((btn) => (
          <button
            key={btn.key}
            className={`filtro-btn ${filtro === btn.key ? "activo" : ""} ${btn.key}`}
            onClick={() => setFiltro(btn.key)}
          >
            <span className="filtro-icono">{btn.icono}</span>
            <span className="filtro-texto">{btn.label}</span>
            <span className="filtro-contador">{contadores[btn.key]}</span>
          </button>
        ))}
      </div>

      {/* 🔽 KANBAN */}
      <div className="kanban">

        {mostrarColumna("novo") && (
          <div className="column">
            <h2 className="col-title">🟡 Novos ({contadores.novo})</h2>
            {pedidos
              .filter(p => normalizar(p.status) === "novo")
              .map(p => (
                <PedidoCard key={p.id} pedido={p} onUpdate={fetchData} />
              ))}
          </div>
        )}

        {mostrarColumna("preparando") && (
          <div className="column">
            <h2 className="col-title">🟠 Preparando ({contadores.preparando})</h2>
            {pedidos
              .filter(p => normalizar(p.status) === "preparando")
              .map(p => (
                <PedidoCard key={p.id} pedido={p} onUpdate={fetchData} />
              ))}
          </div>
        )}

        {mostrarColumna("listo") && (
          <div className="column">
            <h2 className="col-title">🟢 Prontos ({contadores.listo})</h2>
            {pedidos
              .filter(p => normalizar(p.status) === "listo")
              .map(p => (
                <PedidoCard key={p.id} pedido={p} onUpdate={fetchData} />
              ))}
          </div>
        )}

        {mostrarColumna("cancelado") && (
          <div className="column">
            <h2 className="col-title">🔴 Cancelados ({contadores.cancelado})</h2>
            {pedidos
              .filter(p => normalizar(p.status) === "cancelado")
              .map(p => (
                <PedidoCard key={p.id} pedido={p} onUpdate={fetchData} />
              ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Cozinha;