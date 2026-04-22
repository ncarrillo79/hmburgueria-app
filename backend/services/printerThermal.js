import ThermalPrinter from "node-thermal-printer";
const { printer: Printer, types: PrinterTypes } = ThermalPrinter;

export async function imprimirThermal(pedido) {
  try {
    console.log("🖨️ Enviando a impresora térmica, pedido:", pedido.numero);

    const printerPath = process.env.THERMAL_PRINTER_PATH || "\\\\.\\USB001";

    const printer = new Printer({
      type:       PrinterTypes.EPSON,
      interface:  printerPath,
      width:      48,
      characterSet: "PC858_EURO",
    });

    const conectado = await printer.isPrinterConnected();
    if (!conectado) {
      console.error("❌ Impresora térmica no conectada en:", printerPath);
      return;
    }

    printer.alignCenter();
    printer.bold(true);
    printer.setTextSize(1, 1);
    printer.println("HAMBURGUERIA");
    printer.bold(false);
    printer.drawLine();

    printer.alignLeft();
    printer.println(`Pedido #${pedido.numero}`);
    printer.println(`Cliente: ${pedido.cliente}`);
    printer.println(`Direccion: ${pedido.endereco}`);
    printer.drawLine();

    printer.bold(true);
    printer.println("Productos:");
    printer.bold(false);
    printer.println(pedido.descricao);

    if (pedido.comentario) {
      printer.drawLine();
      printer.println(`Obs: ${pedido.comentario}`);
    }

    printer.drawLine();
    printer.println(`Hora: ${pedido.hora}`);
    printer.newLine();
    printer.cut();

    await printer.execute();

    console.log("✅ Ticket impreso correctamente, pedido:", pedido.numero);

  } catch (error) {
    console.error("❌ Error en impresora térmica:", error.message);
  }
}
