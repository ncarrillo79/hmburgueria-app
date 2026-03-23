



import axios from "axios";
import { imprimirPedido } from "../services/printer.js";

const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbw3AsfDAP0lMxBu-NzzEOgx50xp2OZL5TFlz5dvWvcBl_h9sVxadJd68e5NOWAwBdBByQ/exec";
let pedidosYaImpresos = new Set();

export async function revisarPedidos() {
  try {
    console.log("🔍 Revisando pedidos...");

    const res = await axios.get(GOOGLE_SCRIPT_URL);
    const pedidos = res.data;

    // 🔥 VALIDACIÓN CLAVE
    if (!Array.isArray(pedidos)) {
      console.error("❌ La respuesta NO es un array:", pedidos);
      return;
    }

    pedidos.forEach((pedido) => {

      let status = (pedido.status || "").toLowerCase().trim();
      if (status === "novo") status = "nuevo";

      const numero = pedido.numero;

      const cliente = pedido.cliente || "";
      const descripcion = pedido.descricao || "";

      const esValido =
        cliente.trim().length > 0 &&
        descripcion.trim().length > 0;

      console.log(
        "👉 Pedido:",
        numero,
        "| status:",
        status,
        "| cliente:",
        cliente,
        "| descripcion:",
        descripcion,
        "| válido:",
        esValido
      );

      if (
        esValido &&
        status === "nuevo" &&
        !pedidosYaImpresos.has(numero)
      ) {
        console.log("🆕 IMPRIMIENDO PEDIDO:", numero);

        imprimirPedido(pedido);

        pedidosYaImpresos.add(numero);
      }
    });

  } catch (error) {
    console.error("❌ Error watcher:", error.message);
  }
}