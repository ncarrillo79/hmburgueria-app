import React from "react";
import Cozinha from "./pages/Cozinha";

function App() {
  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f6f8"
    }}>
      
      <header style={{
        backgroundColor: "#111",
        color: "#fff",
        padding: "15px",
        textAlign: "center",
        fontSize: "20px",
        fontWeight: "bold"
      }}>
        🍔 Sistema de Cozinha - Hamburgueria
      </header>

      <main style={{ padding: "20px" }}>
        <Cozinha />
      </main>

    </div>
  );
}

export default App;