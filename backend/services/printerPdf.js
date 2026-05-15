import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

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

export function imprimirPdf(pedido) {
  return new Promise((resolve, reject) => {
    try {
      console.log("🖨️ Generando PDF para pedido:", pedido.numero);

      const doc = new PDFDocument();

      const filePath = path.join(
        process.cwd(),
        `pedido-${pedido.numero}.pdf`
      );

      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      const { bairroNome, total, fmt } = calcularTotales(pedido);

      // Encabezado
      const nombre = process.env.BUSINESS_NAME || "Hamburgueria";
      doc.fontSize(16).text(nombre, { align: "center" });
      doc.moveDown();

      // Datos del pedido
      doc.fontSize(12);
      doc.text(`Pedido #${pedido.numero}`);
      doc.text(`Cliente: ${pedido.cliente}`);
      doc.text(`Dirección: ${pedido.endereco}`);
      doc.moveDown();

      // Productos — cada uno en su propia línea
      doc.text("Productos:");
      const productos = (pedido.descricao || "").split(",");
      for (const producto of productos) {
        const linea = producto.trim();
        if (linea) doc.text(`  ${linea}`);
      }
      doc.moveDown();

      // Bairro, taxa y total
      doc.text(`Bairro: ${bairroNome}`);
      doc.text(`Taxa de entrega: ${fmt(pedido.taxa || 0)}`);
      doc.moveDown(0.3);
      doc.fontSize(14).font("Helvetica-Bold").text(`Total: ${fmt(total)}`);
      doc.font("Helvetica").fontSize(12);

      // Observaciones opcionales
      if (pedido.comentario) {
        doc.moveDown();
        doc.text(`Obs: ${pedido.comentario}`);
      }

      // Pie
      doc.moveDown();
      doc.text(`Fecha: ${pedido.data}   Hora: ${pedido.hora}`);

      doc.end();

      stream.on("finish", () => {
        console.log("🧾 PDF generado correctamente:", filePath);
        resolve(true);
      });

      stream.on("error", reject);

    } catch (error) {
      reject(error);
    }
  });
}
