import { imprimirPdf }     from "./printerPdf.js";
import { imprimirThermal } from "./printerThermal.js";

export function imprimirPedido(pedido) {
  const mode = (process.env.PRINTER_MODE || "pdf").toLowerCase();

  if (mode === "thermal") {
    return imprimirThermal(pedido);
  }

  return imprimirPdf(pedido);
}
