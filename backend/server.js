import express from "express";
import axios from "axios";
import { revisarPedidos } from "./jobs/watcher.js";

const app = express();
app.use(express.json());

// 🔥 CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3AsfDAP0lMxBu-NzzEOgx50xp2OZL5TFlz5dvWvcBl_h9sVxadJd68e5NOWAwBdBByQ/exec";

// 📦 GET pedidos (ULTRA SEGURO)
app.get("/pedidos", async (req, res) => {
  try {
    console.log("📡 Llamando Google Sheets...");

    const response = await axios.get(GOOGLE_SCRIPT_URL);

    let data = response.data;

    console.log("📥 RAW:", data);

    // 🔥 PROTEGER TODO
    if (!data) data = [];
    if (!Array.isArray(data)) {
      console.log("⚠️ No es array, forzando array");
      data = [];
    }

    const pedidos = data.map((p, index) => {
      return {
        numero: p?.numero || index + 1,
        cliente: p?.cliente || "",
        endereco: p?.endereco || "",
        descricao: p?.descricao || "",
        comentario: p?.comentario || "",
        status: p?.status || "Novo",
        data: p?.data || "",
        hora: p?.hora || "",
        eliminado: p?.eliminado || ""
      };
    });

    res.json(pedidos);

  } catch (error) {
    console.error("❌ ERROR REAL:", error.response?.data || error.message);

    // 🔥 NO ROMPER NUNCA
    res.json([]); 
  }
});

// 🔄 STATUS / ELIMINAR
app.post("/status", async (req, res) => {
  try {
    const { numero, status, eliminar } = req.body;

    console.log("📥 STATUS:", req.body);

    await axios.post(GOOGLE_SCRIPT_URL, {
      numero,
      status: eliminar ? null : status,
      eliminar: eliminar || false
    });

    res.json({ ok: true });

  } catch (error) {
    console.error("❌ ERROR STATUS:", error.message);
    res.status(500).json({ error: "Error actualizando pedido" });
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