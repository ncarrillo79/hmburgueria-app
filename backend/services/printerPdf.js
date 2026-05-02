import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export function imprimirPdf(pedido) {
  try {
    console.log("🖨️ Generando PDF para pedido:", pedido.numero);

    const doc = new PDFDocument();

    const filePath = path.join(
      process.cwd(),
      `pedido-${pedido.numero}.pdf`
    );

    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    const nombre = process.env.BUSINESS_NAME || "Hamburgueria";
    doc.fontSize(16).text(nombre, { align: "center" });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Pedido #${pedido.numero}`);
    doc.text(`Cliente: ${pedido.cliente}`);
    doc.text(`Dirección: ${pedido.endereco}`);
    doc.moveDown();

    doc.text("Productos:");
    doc.text(pedido.descricao);

    if (pedido.comentario) {
      doc.moveDown();
      doc.text(`Obs: ${pedido.comentario}`);
    }

    doc.moveDown();
    doc.text(`Hora: ${pedido.hora}`);

    doc.end();

    stream.on("finish", () => {
      console.log("🧾 PDF generado correctamente:", filePath);
    });

  } catch (error) {
    console.error("❌ Error generando PDF:", error.message);
  }
}
