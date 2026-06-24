import React, { useState, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Cozinha from "./pages/Cozinha";

function App() {
  const [hora, setHora] = useState("");

  useEffect(() => {
    const tick = () => {
      setHora(
        new Date().toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "America/Sao_Paulo",
        })
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="app-root">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1a1a2e",
            color: "#f0f4ff",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: "12px",
            fontFamily: "Inter, sans-serif",
            fontSize: "14px",
          },
        }}
      />

      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo">🍔</div>
          <div>
            <div className="header-title">HM Hamburgueria</div>
            <div className="header-subtitle">Sistema de Cozinha</div>
          </div>
        </div>

        <div className="header-right">
          <div className="live-badge">
            <span className="live-dot" />
            <span>AO VIVO</span>
          </div>
          <div className="header-clock">{hora}</div>
        </div>
      </header>

      <main className="app-main">
        <Cozinha />
      </main>
    </div>
  );
}

export default App;
