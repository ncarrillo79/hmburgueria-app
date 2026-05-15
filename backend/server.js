import "dotenv/config";
import express from "express";
import axios from "axios";
import { revisarPedidos } from "./jobs/watcher.js";

const app = express();
app.use(express.json());

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SCRIPT_URL;

// 📦 GET pedidos
app.get("/pedidos", async (req, res) => {
  try {
    console.log("📡 Llamando Google Sheets...");

    const response = await axios.get(GOOGLE_SCRIPT_URL);
    let data = response.data;

    if (!data || !Array.isArray(data)) {
      console.log("⚠️ Respuesta inesperada, forzando array vacío");
      data = [];
    }

    const pedidos = data.map((p, index) => {
      return {
        // 🔥 id = timestamp estable que usa el Apps Script para identificar la fila
        id: p?.id ?? null,

        // numero = solo para mostrar en pantalla (posición 1-based)
        numero: index + 1,

        cliente:    p?.cliente    || "",
        endereco:   p?.endereco   || "",
        descricao:  p?.descricao  || "",
        comentario: p?.comentario || "",
        bairro:     p?.bairro     || "",
        taxa:       p?.taxa       ?? 0,
        status:     p?.status     || "Novo",

        // data y hora vienen formateadas por el Apps Script en GMT-3
        data:       p?.data       || "",
        hora:       p?.hora       || "",

        // createdAt = ISO string UTC → úsalo para calcular tiempo transcurrido
        createdAt:  p?.createdAt  || null,

        eliminado:  p?.eliminado  ?? false,
        impreso:    p?.impreso    ?? false,
      };
    });

    res.json(pedidos);

  } catch (error) {
    console.error("❌ ERROR GET /pedidos:", error.response?.data || error.message);
    res.json([]);
  }
});

// 🔄 POST /status — actualizar status o soft-delete
app.post("/status", async (req, res) => {
  try {
    // 🔥 recibe id (timestamp), no numero
    const { id, status, eliminar, impreso } = req.body;

    console.log("📥 POST /status:", req.body);

    if (!id) {
      return res.status(400).json({ ok: false, error: "Falta el campo id" });
    }

    // Llamamos al Apps Script y capturamos su respuesta
    const gsResponse = await axios.post(GOOGLE_SCRIPT_URL, {
      id,
      status:   eliminar ? undefined : status,
      eliminar: eliminar  ?? false,
      impreso:  impreso   ?? undefined,
    });

    console.log("📤 Respuesta Apps Script:", gsResponse.data);

    // 🔥 validamos la respuesta del Apps Script antes de confirmar éxito
    if (gsResponse.data?.ok === false) {
      return res.status(404).json({
        ok: false,
        error: gsResponse.data.error || "Pedido no encontrado en la hoja",
      });
    }

    res.json({ ok: true });

  } catch (error) {
    console.error("❌ ERROR POST /status:", error.message);
    res.status(500).json({ ok: false, error: "Error actualizando pedido" });
  }
});

// 🚀 SERVER
app.listen(3001, () => {
  console.log("🚀 Backend corriendo en http://localhost:3001");
});

// 🖨️ WATCHER — revisa pedidos nuevos cada 5s para imprimir
setInterval(() => {
  revisarPedidos();
}, 5000);