import JsBarcode from "jsbarcode";

export function generarPdf(data) {
  console.log("Xd:");
  console.log(data);
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
            [
              { text: "Área", style: "tableHeader" },
              data.area === "Otra"
                ? data.areaOtra + " (" + data.area + ")"
                : data.area,
            ],
            [{ text: "Fecha", style: "tableHeader" }, data.fecha],
            [{ text: "Turno", style: "tableHeader" }, data.turno],
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

  // Verificar si hay defecto en lámina
  if (data.defectoEnLamina && data.defectoEnLamina !== "Ningún defecto") {
    pdfDefinition.content.push({
      style: "tableExample",
      table: {
        widths: ["*", "*"],
        body: [
          [
            { text: "Defecto en lámina", style: "tableHeader" },
            data.defectoEnLamina === "Otros"
              ? data.defectoEnLaminaOtros + " (" + data.defectoEnLamina + ")"
              : data.defectoEnLamina,
          ],
          [
            { text: "Causa de defecto en lámina", style: "tableHeader" },
            data.causaLamina,
          ],
        ],
      },
    });
  }

  // Verificar si hay defecto en caja
  if (data.defectoEnCaja && data.defectoEnCaja !== "Ningún defecto") {
    pdfDefinition.content.push({
      style: "tableExample",
      table: {
        widths: ["*", "*"],
        body: [
          [
            { text: "Defecto en caja", style: "tableHeader" },
            data.defectoEnCaja === "Otros"
              ? data.defectoEnCajaOtros + " (" + data.defectoEnCaja + ")"
              : data.defectoEnCaja,
          ],
          [
            { text: "Causa de defecto en caja", style: "tableHeader" },
            data.causaCaja,
          ],
        ],
      },
    });
  }

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
