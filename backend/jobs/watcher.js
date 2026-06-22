import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { imprimirPedido } from "../services/printer.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BACKEND_URL = `http://localhost:${process.env.PORT || 3001}`;
const IMPRESOS_PATH = path.join(__dirname, "../pedidos-impresos.json");

function cargarImpresos() {
  try {
    if (fs.existsSync(IMPRESOS_PATH)) {
      const ids = JSON.parse(fs.readFileSync(IMPRESOS_PATH, "utf8"));
      console.log(`📂 ${ids.length} pedidos ya impresos cargados desde disco`);
      return new Set(ids);
    }
  } catch (err) {
    console.error("⚠️ No se pudo leer pedidos-impresos.json:", err.message);
  }
  return new Set();
}

function persistirImpresos(set) {
  try {
    fs.writeFileSync(IMPRESOS_PATH, JSON.stringify([...set]));
  } catch (err) {
    console.error("⚠️ No se pudo guardar pedidos-impresos.json:", err.message);
  }
}

let pedidosYaImpresos = cargarImpresos();

export async function revisarPedidos() {
  try {
    console.log("🔍 Revisando pedidos...");

    const res = await axios.get(`${BACKEND_URL}/pedidos`);
    const pedidos = res.data;

    if (!Array.isArray(pedidos)) {
      console.error("❌ La respuesta NO es un array:", pedidos);
      return;
    }

    for (const pedido of pedidos) {
      const status = (pedido.status || "").toLowerCase().trim();
      const id = pedido.id;
      const cliente = pedido.cliente || "";
      const descripcion = pedido.descricao || "";

      const esValido =
        id &&
        cliente.trim().length > 0 &&
        descripcion.trim().length > 0;

      console.log(
        "👉 Pedido:", pedido.numero,
        "| id:", id,
        "| status:", status,
        "| válido:", esValido
      );

      if (esValido && status === "novo" && !pedido.impreso && !pedido.eliminado && !pedidosYaImpresos.has(id)) {
        console.log("🆕 IMPRIMIENDO PEDIDO:", pedido.numero);
        try {
          await imprimirPedido(pedido);
          pedidosYaImpresos.add(id);
          persistirImpresos(pedidosYaImpresos);
          console.log("✅ Pedido impreso y persistido:", pedido.numero);
        } catch (err) {
          console.error("❌ Falló la impresión, no se marca como impreso:", err.message);
        }
      }
    }

  } catch (error) {
    console.error("❌ Error watcher:", error.message);
  }
}
