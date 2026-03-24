import React, { useEffect, useRef, useState } from "react";
import PedidoCard from "../components/PedidoCard";
import { getPedidos } from "../services/api";

function Cozinha() {
  const [pedidos, setPedidos] = useState([]);

  // 🔥 useRef → SIEMPRE actualizado
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

      const idsActuales = visibles.map(p => p.numero);

      const nuevos = idsActuales.filter(
        id => !idsPreviosRef.current.includes(id)
      );

      // 🔔 SOLO SI HAY NUEVOS
      if (nuevos.length > 0 && idsPreviosRef.current.length > 0) {
        console.log("🔔 NUEVO PEDIDO:", nuevos);

        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }

      // 🔥 actualizar ref correctamente
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

  return (
    <div className="kanban">

      <div className="column">
        <h2 className="col-title">🟡 Nuevos</h2>
        {pedidos
          .filter(p => normalizar(p.status) === "novo")
          .map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
      </div>

      <div className="column">
        <h2 className="col-title">🟠 Preparando</h2>
        {pedidos
          .filter(p => normalizar(p.status) === "preparando")
          .map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
      </div>

      <div className="column">
        <h2 className="col-title">🟢 Listos</h2>
        {pedidos
          .filter(p => normalizar(p.status) === "listo")
          .map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
      </div>

      <div className="column">
        <h2 className="col-title">🔴 Cancelados</h2>
        {pedidos
          .filter(p => normalizar(p.status) === "cancelado")
          .map(p => (
            <PedidoCard key={p.numero} pedido={p} onUpdate={fetchData} />
          ))}
      </div>

    </div>
  );
}

export default Cozinha;