<template>
  <v-data-table :headers="headers" :items="filteredControles">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Documentos</v-toolbar-title>

        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field
          v-model="search"
          label="Buscar"
          solo-inverted
          clearable
        ></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn variant="tonal" @click="redirectToForm">Crear documento</v-btn>

        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <v-card>
            <v-card-title>
              <span class="text-h5">Documento</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <p>Código documento: {{ editedItem.codigoDocumento }}</p>
                </v-row>
                <v-row
                  ><p>Revisión N°: {{ editedItem.nroRevision }}</p>
                </v-row>
                <v-row>
                  <p>Área: {{ editedItem.area }}</p>
                </v-row>
                <v-row>
                  <p>Fecha: {{ editedItem.fecha }}</p>
                </v-row>
                <v-row>
                  <p>Turno: {{ editedItem.turno }}</p>
                </v-row>
                <v-row>
                  <p>Responsable: {{ editedItem.responsable }}</p>
                </v-row>
                <v-row>
                  <p>Defecto en lamina: {{ editedItem.defectoEnLamina }}</p>
                </v-row>
                <v-row v-if="editedItem.defectoEnLamina !== 'Ningún defecto'">
                  <p>Causa lamina: {{ editedItem.causaLamina }}</p>
                </v-row>
                <v-row>
                  <p>Defecto en caja: {{ editedItem.defectoEnCaja }}</p>
                </v-row>
                <v-row v-if="editedItem.defectoEnCaja !== 'Ningún defecto'">
                  <p>Causa caja: {{ editedItem.causaCaja }}</p>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="red darken-1"
                variant="tonal"
                @click="crearPdf(editedItem)"
              >
                <v-icon left> mdi-file-pdf </v-icon>
                Generar PDF
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn color="red-darken-1" variant="text" @click="close">
                Cerrar
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editItem(item)">
        mdi-eye
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn @click="initialize"> Recargar </v-btn>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

// Carga las fuentes necesarias para pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { key: "codigoDocumento", title: "Código documento" },
      { key: "nroRevision", title: "Revisión N°" },
      { key: "area", title: "Área" },
      { key: "fecha", title: "Fecha" },
      { key: "turno", title: "Turno" },
      { key: "responsable", title: "Responsable" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    controles: [],
    documentos: [],
    editedIndex: -1,
    editedItem: {
      codigoDocumento: "",
      nroRevision: "",
      area: "",
      fecha: "",
      turno: "",
      responsable: "",
    },
    defaultItem: {
      codigoDocumento: "",
      nroRevision: "",
      area: "",
      fecha: "",
      turno: "",
      responsable: "",
    },
  }),

  computed: {
    filteredControles() {
      return this.controles.filter((item) => {
        return Object.values(item).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(this.search.toLowerCase())
        );
      });
    },
  },

  watch: {
    dialog(val) {
      val || this.close();
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.initialize();
    this.obtenerControles();
  },

  methods: {
    clearSearch() {
      this.search = "";
    },
    redirectToForm() {
      // Puedes redirigir a la ruta del formulario aquí, por ejemplo:
      this.$router.push("/form");
    },
    formatFecha(fecha) {
      // Formatea la fecha (cadena ISO 8601) a "DD-MM-YYYY"
      const parts = fecha.split("T")[0].split("-");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    },
    async obtenerControles() {
      const response = await axios.get(
        "http://localhost:3000/api/obtenerTodos"
      );
      this.controles = response.data;
      this.controles.forEach((control) => {
        control.fecha = this.formatFecha(control.fecha);
      });
    },
    initialize() {},
    crearPdf(data) {
      // Generar el PDF
      const pdf = this.generarPdf(data);

      // Abre el PDF en una nueva ventana
      pdfMake.createPdf(pdf).open();
    },
    generarPdf(data) {
      const pdfDefinition = {
        content: [
          {
            text: "CONTROL DE DESPERDICIO",
            style: "header",
            alignment: "center",
          },
          {
            text: "Código documento: XX",
            style: "subheader",
            alignment: "center",
          },
          { text: "Revisión N°: X", style: "subheader", alignment: "center" },
          {
            style: "tableExample",
            table: {
              widths: ["*", "*"],
              body: [
                ["Área", data.area],
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
              ["Defecto en lámina", data.defectoEnLamina],
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
              ["Defecto en caja", data.defectoEnCaja],
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

      return pdfDefinition;
    },

    editItem(item) {
      this.editedIndex = this.controles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    deleteItem(item) {
      this.editedIndex = this.controles.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.controles.splice(this.editedIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.controles[this.editedIndex], this.editedItem);
      } else {
        this.controles.push(this.editedItem);
      }
      this.close();
    },
  },
};
</script>
