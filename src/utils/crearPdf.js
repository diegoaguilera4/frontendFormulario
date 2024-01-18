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
          text: "\nRevisión N°: "+data.nroRevision+"\n",
          style: "subheader",
          alignment: "center",
        },
        {
          style: "tableExample",
          table: {
            widths: ["*", "*"],
            body: [
              ["Área", data.area==="Otra" ? data.areaOtra+" ("+data.area+")" : data.area],
              ["Fecha", new Date().toLocaleDateString()],
              ["Turno", data.turno],
              ["Responsable del rechazo", data.responsable],
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
          background: "#FF0000", // Fondo rojo
          color: "#FFFFFF", // Color de texto blanco
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
            ["Defecto en lámina", data.defectoEnLamina==="Otros" ? data.defectoEnLaminaOtros+" ("+data.defectoEnLamina+")" : data.defectoEnLamina],
            ["Causa de defecto en lámina", data.causaLamina],
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
            ["Defecto en caja", data.defectoEnCaja==="Otros" ? data.defectoEnCajaOtros+" ("+data.defectoEnCaja+")" : data.defectoEnCaja],
            ["Causa de defecto en caja", data.causaCaja],
          ],
        },
      });
    }

    pdfDefinition.content.push(
      {
        style: "tableExample",
        table: {
          widths: ["*", "*"],
          body: [
            ["Operador picadora", data.operadorPicadora],
            ["Cliente", data.cliente],
            ["Producto", data.producto],
            ["Cantidad", data.cantidad],
            ["Nro OP", data.nroOp],
          ],
        },
      },
      {
        style: "tableExample",
        table: {
          widths: ["*", "*"],
          body: [
            ["Autoriza picar", data.autorizaPicar],
            ["Total kilos", data.totalKilos],
          ],
        },
      }
    );

    const canvas = document.createElement("canvas");
    JsBarcode(canvas, data._id, { format: "CODE128" });
    // Redimensionar el canvas

    // Convertir el canvas a imagen y agregarla al documento PDF
    const imageData = canvas.toDataURL("image/png");
    pdfDefinition.content.push({
      image: imageData,
      alignment: "center",
      width: 300,
    });

    return pdfDefinition;
  }

