import ThermalPrinter from "node-thermal-printer";
const { printer: Printer, types: PrinterTypes } = ThermalPrinter;

function calcularTotales(pedido) {
  const bairroNome = (pedido.bairro || "").split("—")[0].trim();

  const subtotal = ((pedido.descricao || "").match(/R\$\s*([\d]+,[\d]+)/g) || [])
    .reduce((acc, m) => {
      const num = m.replace(/R\$\s*/, "").replace(",", ".");
      return acc + parseFloat(num);
    }, 0);

  const total = subtotal + (pedido.taxa || 0);
  const fmt = n => "R$ " + n.toFixed(2).replace(".", ",");

  return { bairroNome, total, fmt };
}

export async function imprimirThermal(pedido) {
  console.log("🖨️ Enviando a impresora térmica, pedido:", pedido.numero);

  const printerPath = process.env.THERMAL_PRINTER_PATH || "\\\\.\\USB001";

  const printer = new Printer({
    type:         PrinterTypes.EPSON,
    interface:    printerPath,
    width:        48,
    characterSet: "PC858_EURO",
  });

  const conectado = await printer.isPrinterConnected();
  if (!conectado) {
    throw new Error(`Impresora térmica no conectada en: ${printerPath}`);
  }

  const { bairroNome, total, fmt } = calcularTotales(pedido);

  // Encabezado
  printer.alignCenter();
  printer.bold(true);
  printer.setTextSize(1, 1);
  printer.println(process.env.BUSINESS_NAME || "Hamburgueria");
  printer.bold(false);
  printer.drawLine();

  // Datos del pedido
  printer.alignLeft();
  printer.println(`Pedido #${pedido.numero}`);
  printer.println(`Cliente: ${pedido.cliente}`);
  printer.println(`Direccion: ${pedido.endereco}`);
  printer.drawLine();

  // Productos — descricao es un string separado por comas
  printer.bold(true);
  printer.println("Productos:");
  printer.bold(false);

  const productos = (pedido.descricao || "").split(",");
  for (const producto of productos) {
    const linea = producto.trim();
    if (linea) printer.println(linea);
  }

  // Bairro, taxa y total
  printer.drawLine();
  printer.println(`Bairro: ${bairroNome}`);
  printer.println(`Taxa de entrega: ${fmt(pedido.taxa || 0)}`);
  printer.drawLine();
  printer.bold(true);
  printer.println(`Total: ${fmt(total)}`);
  printer.bold(false);

  // Observaciones opcionales
  if (pedido.comentario) {
    printer.drawLine();
    printer.println(`Obs: ${pedido.comentario}`);
  }

  // Pie con fecha y hora
  printer.drawLine();
  printer.println(`Fecha: ${pedido.data}   Hora: ${pedido.hora}`);
  printer.newLine();
  printer.cut();

  await printer.execute();

  console.log("✅ Ticket impreso correctamente, pedido:", pedido.numero);
  return true;
}
