import JsBarcode from "jsbarcode";

export function generarPdf(data) {
  const pdfDefinition = {
    content: [
      {
        text: "                                                                                                                              ",
        style: "header",
        alignment: "center",
      },
      {
        text: "                                          CONTROL DE DESPERDICIO                                          ",
        style: "header",
        alignment: "center",
      },
      {
        text: "                                                                                                                              ",
        style: "header",
        alignment: "center",
      },
      {
        text: "\nRevisión N°: " + data.nroRevision + "\n",
        style: "subheader",
        alignment: "center",
      },
      {
        style: "tableExample",
        table: {
          widths: ["*", "*"],
          body: [
            [{ text: "Código documento", style: "tableHeader" }, data.idAux],
            [{ text: "Fecha", style: "tableHeader" }, data.fecha],
            [{ text: "Turno", style: "tableHeader" }, data.turno],
            [{ text: "Tipo", style: "tableHeader" }, data.tipo],
            [{ text: "Area", style: "tableHeader" }, data.area],
            [{ text: "Defecto", style: "tableHeader" }, data.defecto],

            [
              { text: "Responsable del rechazo", style: "tableHeader" },
              data.responsable,
            ],
          ],
        },
      },
    ],
    styles: {
      tableExample: {
        margin: [0, 5, 0, 15],
      },
      header: {
        fontSize: 20,
        bold: true,
        background: "#D90000", // Fondo rojo
        color: "#FFFFFF", // Color de texto blanco
      },
      tableHeader: {
        bold: true,
      },
    },
  };

  pdfDefinition.content.push({
    style: "tableExample",
    table: {
      widths: ["*", "*"],
      body: [
        [{ text: "N° Op", style: "tableHeader" }, data.nroOp],
        [{ text: "Código", style: "tableHeader" }, data.estNumber],
        [{ text: "Producto", style: "tableHeader" }, data.producto],
        [{ text: "Cliente", style: "tableHeader" }, data.cliente],
        [{ text: "Cantidad", style: "tableHeader" }, data.cantidad],
      ],
    },
  });

  const canvas = document.createElement("canvas");
  JsBarcode(canvas, data.idAux, { format: "CODE128" });
  // Redimensionar el canvas

  // Convertir el canvas a imagen y agregarla al documento PDF
  const imageData = canvas.toDataURL("image/png");
  pdfDefinition.content.push({
    image: imageData,
    alignment: "center",
  });

  return pdfDefinition;
}
