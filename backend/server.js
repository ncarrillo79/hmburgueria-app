import express from "express";
import axios from "axios";
import { revisarPedidos } from "./jobs/watcher.js";

const app = express();
app.use(express.json());

// 🔥 CORS COMPLETO (SOLUCIÓN)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // 👇 RESPUESTA AL PREFLIGHT
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3AsfDAP0lMxBu-NzzEOgx50xp2OZL5TFlz5dvWvcBl_h9sVxadJd68e5NOWAwBdBByQ/exec";

// 📦 GET pedidos
app.get("/pedidos", async (req, res) => {
  try {
    const response = await axios.get(GOOGLE_SCRIPT_URL);
    res.json(response.data);
  } catch (error) {
    console.error("❌ Error GET:", error.message);
    res.status(500).json({ error: "Error obteniendo pedidos" });
  }
});

// 🔄 ACTUALIZAR STATUS
app.post("/status", async (req, res) => {
  try {
    const { numero, status } = req.body;

    await axios.post(GOOGLE_SCRIPT_URL, {
      action: "updateStatus",
      numero,
      status
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error STATUS:", error.message);
    res.status(500).json({ error: "Error actualizando status" });
  }
});

// ❌ ELIMINAR
app.post("/delete", async (req, res) => {
  try {
    const { numero } = req.body;

    await axios.post(GOOGLE_SCRIPT_URL, {
      action: "delete",
      numero
    });

    res.json({ success: true });
  } catch (error) {
    console.error("❌ Error DELETE:", error.message);
    res.status(500).json({ error: "Error eliminando pedido" });
  }
});

// 🚀 SERVER
app.listen(3001, () => {
  console.log("🚀 Backend corriendo en http://localhost:3001");
});

// 🖨️ WATCHER
setInterval(() => {
  revisarPedidos();
}, 5000);