import React, { useEffect, useRef, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../services/api";

const BOTONES_FILTRO = [
  { key: "todos",      label: "Todos",      icono: "◈" },
  { key: "novo",       label: "Novos",      icono: "●" },
  { key: "preparando", label: "Preparando", icono: "●" },
  { key: "listo",      label: "Prontos",    icono: "●" },
  { key: "cancelado",  label: "Cancelados", icono: "●" },
];

const COLUMNAS = [
  { key: "novo",       label: "NOVOS",      cls: "col-novo",       vazio: "Nenhum pedido novo" },
  { key: "preparando", label: "PREPARANDO", cls: "col-preparando", vazio: "Nenhum em preparo" },
  { key: "listo",      label: "PRONTOS",    cls: "col-listo",      vazio: "Nenhum pronto" },
  { key: "cancelado",  label: "CANCELADOS", cls: "col-cancelado",  vazio: "Nenhum cancelado" },
];

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const idsPreviosRef = useRef([]);
  const audioRef = useRef(null);

  useEffect(() => {
    audioRef.current = new Audio("/notify.mp3");
    const unlock = () => {
      audioRef.current.play().then(() => {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }).catch(() => {});
      window.removeEventListener("click", unlock);
    };
    window.addEventListener("click", unlock);
    return () => window.removeEventListener("click", unlock);
  }, []);

  const fetchData = async () => {
    try {
      const data = await getPedidos();
      const visibles = (data || []).filter(
        (p) => String(p.eliminado).toLowerCase() !== "true"
      );
      const idsActuales = visibles.map((p) => p.id);
      const nuevos = idsActuales.filter(
        (id) => !idsPreviosRef.current.includes(id)
      );
      if (nuevos.length > 0 && idsPreviosRef.current.length > 0) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
      idsPreviosRef.current = idsActuales;
      setPedidos(visibles);
    } catch (e) {
      console.error("Error fetch:", e);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const norm = (s) => (s || "").toLowerCase().trim();

  const contadores = {
    todos:      pedidos.length,
    novo:       pedidos.filter((p) => norm(p.status) === "novo").length,
    preparando: pedidos.filter((p) => norm(p.status) === "preparando").length,
    listo:      pedidos.filter((p) => norm(p.status) === "listo").length,
    cancelado:  pedidos.filter((p) => norm(p.status) === "cancelado").length,
  };

  const columnasFiltradas =
    filtro === "todos"
      ? COLUMNAS
      : COLUMNAS.filter((c) => c.key === filtro);

  return (
    <div className="cozinha-root">

      {/* ── FILTRO BAR ── */}
      <div className="filtro-bar">
        {BOTONES_FILTRO.map((btn) => (
          <button
            key={btn.key}
            className={`filtro-btn ${btn.key} ${filtro === btn.key ? "activo" : ""}`}
            onClick={() => setFiltro(btn.key)}
          >
            <span className={`filtro-dot filtro-dot-${btn.key}`} />
            <span className="filtro-texto">{btn.label}</span>
            <span className="filtro-contador">{contadores[btn.key]}</span>
          </button>
        ))}
      </div>

      {/* ── KANBAN ── */}
      <div className="kanban">
        {columnasFiltradas.map((col) => {
          const cards = pedidos.filter((p) => norm(p.status) === col.key);
          return (
            <div key={col.key} className={`column ${col.cls}`}>
              <div className="column-inner">

                <div className="col-header">
                  <div className="col-title-wrap">
                    <div className="col-status-dot" />
                    <h2 className="col-title">{col.label}</h2>
                  </div>
                  <span className="col-count">{cards.length}</span>
                </div>

                <div className="column-cards">
                  {cards.length === 0 ? (
                    <div className="col-empty">
                      <div className="col-empty-icon">📭</div>
                      {col.vazio}
                    </div>
                  ) : (
                    cards.map((p) => (
                      <PedidoCard key={p.id} pedido={p} onUpdate={fetchData} />
                    ))
                  )}
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default Cozinha;
