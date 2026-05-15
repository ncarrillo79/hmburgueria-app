// Columna K (índice 10 en base 0) es donde guardamos el UUID estable.
// Asegurate de que la celda K1 tenga el encabezado "ID" y que la columna K
// no se use para otra cosa.
//
// Mapeo de columnas (base 0):
//   row[0]  = Marca temporal
//   row[1]  = Nome do Cliente
//   row[2]  = Endereço de Entrega
//   row[3]  = Selecao de Produtos
//   row[4]  = Comentario/Observação
//   row[5]  = Bairro — formato "Nome — R$ XX,00"  ← NUEVO
//   row[6]  = (columna vacía — ignorar)
//   row[7]  = Status                               (era row[5])
//   row[8]  = Eliminado                            (era row[6])
//   row[9]  = Impreso                              (era row[7])
//   row[10] = UUID                                 (era row[8])

const COL_ID = 11; // columna K (base 1, para usar con getRange)

function doGet() {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Respuestas de formulario 1");

  const data = sheet.getDataRange().getValues();

  const pedidos = [];

  for (let i = 1; i < data.length; i++) {

    const row = data[i];

    const createdAtRaw = row[0];
    const cliente    = row[1] || "";
    const endereco   = row[2] || "";
    const descricao  = row[3] || "";
    const comentario = row[4] || "";

    // Bairro: "Nome — R$ XX,00" → extraer taxa
    const bairro     = String(row[5] || "").trim();
    const taxaMatch  = bairro.match(/R\$\s*([\d]+[,.][\d]+)/);
    const taxa       = taxaMatch ? parseFloat(taxaMatch[1].replace(",", ".")) : 0;

    // row[6] ignorado (columna vacía)

    const status    = row[7] || "Novo";
    const eliminado = row[8] === true || row[8] === "true";
    const impreso   = row[9] === true || row[9] === "true";

    // Leemos el UUID de la columna K (row[10])
    let uuid = row[10];

    // Si la fila no tiene UUID todavía, generamos uno y lo escribimos
    if (!uuid) {
      uuid = Utilities.getUuid();
      sheet.getRange(i + 1, COL_ID).setValue(uuid);
    }

    // Ignoramos filas sin timestamp (filas huérfanas o basura)
    if (!createdAtRaw) {
      continue;
    }

    const createdAt = new Date(createdAtRaw);

    // Ignoramos filas con fecha inválida
    if (isNaN(createdAt.getTime())) {
      continue;
    }

    const dataFormatada = Utilities.formatDate(
      createdAt,
      "GMT-3",
      "dd/MM/yyyy"
    );

    const horaFormatada = Utilities.formatDate(
      createdAt,
      "GMT-3",
      "HH:mm"
    );

    pedidos.push({
      id: uuid,
      cliente,
      endereco,
      descricao,
      comentario,
      bairro,
      taxa,
      status,
      eliminado,
      impreso,
      createdAt: createdAt.toISOString(),
      data: dataFormatada,
      hora: horaFormatada
    });
  }

  return ContentService
    .createTextOutput(JSON.stringify(pedidos))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const sheet = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName("Respuestas de formulario 1");

  const body = JSON.parse(e.postData.contents);

  const id       = body.id;
  const status   = body.status;
  const eliminar = body.eliminar;
  const impreso  = body.impreso;

  if (!id) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Falta el campo id" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  const data = sheet.getDataRange().getValues();

  // Buscamos por UUID en la columna K (índice 10)
  let fila = -1;

  for (let i = 1; i < data.length; i++) {
    const rowUuid = data[i][10];
    if (rowUuid === id) {
      fila = i + 1;
      break;
    }
  }

  if (fila === -1) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: "Pedido no encontrado" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (status) {
    sheet.getRange(fila, 8).setValue(status);       // col H (era col F)
  }

  if (eliminar !== undefined) {
    sheet.getRange(fila, 9).setValue(               // col I (era col G)
      eliminar === true || eliminar === "true"
    );
  }

  if (impreso !== undefined) {
    sheet.getRange(fila, 10).setValue(              // col J (era col H)
      impreso === true || impreso === "true"
    );
  }

  return ContentService
    .createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}


