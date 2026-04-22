



import axios from "axios";
import { imprimirPedido } from "../services/printer.js";

const BACKEND_URL = "http://localhost:3001";
let pedidosYaImpresos = new Set();

export async function revisarPedidos() {
  try {
    console.log("🔍 Revisando pedidos...");

    const res = await axios.get(`${BACKEND_URL}/pedidos`);
    const pedidos = res.data;

    if (!Array.isArray(pedidos)) {
      console.error("❌ La respuesta NO es un array:", pedidos);
      return;
    }

    pedidos.forEach((pedido) => {
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
        imprimirPedido(pedido);
        pedidosYaImpresos.add(id);
      }
    });

  } catch (error) {
    console.error("❌ Error watcher:", error.message);
  }
}