import jsPDF from "jspdf";

export function imprimirPedido(pedido) {
  const doc = new jsPDF();
  doc.text(`Pedido #${pedido.numero}`, 10, 10);
  doc.text(`Cliente: ${pedido.cliente}`, 10, 20);
  doc.text(`Descrição: ${pedido.descricao}`, 10, 30);
  doc.text(`Endereço: ${pedido.endereco}`, 10, 40);
  doc.text(`Status: ${pedido.status}`, 10, 50);

  if (pedido.data && pedido.hora) {
    doc.text(`Recebido: ${pedido.data} às ${pedido.hora}`, 10, 60);
  } else if (pedido.timestamp) {
    doc.text(`Recebido: ${new Date(pedido.timestamp).toLocaleString()}`, 10, 60);
  }

  doc.save(`pedido-${pedido.numero}.pdf`);
}
