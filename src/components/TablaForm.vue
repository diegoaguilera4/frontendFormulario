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
          @click:clear="clearSearch"
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
                  <p>Código documento: {{ verItem._id }}</p>
                </v-row>
                <v-row
                  ><p>Revisión N°: {{ verItem.nroRevision }}</p>
                </v-row>
                <v-row>
                  <p>Área: {{ verItem.area }}</p>
                </v-row>
                <v-row>
                  <p>Fecha: {{ verItem.fecha }}</p>
                </v-row>
                <v-row>
                  <p>Turno: {{ verItem.turno }}</p>
                </v-row>
                <v-row>
                  <p>Responsable: {{ verItem.responsable }}</p>
                </v-row>
                <v-row>
                  <p>Defecto en lamina: {{ verItem.defectoEnLamina }}</p>
                </v-row>
                <v-row v-if="verItem.defectoEnLamina !== 'Ningún defecto'">
                  <p>Causa lamina: {{ verItem.causaLamina }}</p>
                </v-row>
                <v-row>
                  <p>Defecto en caja: {{ verItem.defectoEnCaja }}</p>
                </v-row>
                <v-row v-if="verItem.defectoEnCaja !== 'Ningún defecto'">
                  <p>Causa caja: {{ verItem.causaCaja }}</p>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-btn
                color="red darken-1"
                variant="tonal"
                @click="crearPdf(verItem)"
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
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >¿Estas seguro que deseas eliminar este documento?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="red-darken-1"
                variant="tonal"
                @click="deleteItemConfirm"
                >Eliminar</v-btn
              >
              <v-btn color="blue-darken-1" variant="tonal" @click="closeDelete"
                >Cancelar</v-btn
              >
              
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="mostrarItem(item)">
        mdi-eye
      </v-icon>
      <v-icon size="small" class="me-2" @click="editarItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <v-text>No existen resultados</v-text>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generarPdf } from "../utils/crearPdf";

// Carga las fuentes necesarias para pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    headers: [
      { key: "_id", title: "Código documento" },
      { key: "nroRevision", title: "Revisión N°" },
      { key: "area", title: "Área" },
      { key: "fecha", title: "Fecha" },
      { key: "turno", title: "Turno" },
      { key: "responsable", title: "Responsable" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    controles: [],
    documentos: [],
    verIndex: -1,
    verItem: {
      _id: "",
      nroRevision: "",
      area: "",
      fecha: "",
      turno: "",
      responsable: "",
    },
    defaultItem: {
      _id: "",
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
      this.$router.push("/nuevoDocumento");
    },
    formatFecha(fecha) {
      // Formatea la fecha (cadena ISO 8601) a "DD-MM-YYYY"
      const parts = fecha.split("T")[0].split("-");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    },
    async obtenerControles() {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/obtenerTodos"
        );

        // Verificar si la respuesta tiene datos
        if (response.data) {
          this.controles = response.data;

          // Formatear las fechas
          this.controles.forEach((control) => {
            control.fecha = this.formatFecha(control.fecha);
          });
        } else {
          console.error("La respuesta no contiene datos válidos.");
          // Puedes lanzar una excepción personalizada o manejarla según tus necesidades.
        }
      } catch (error) {
        console.error("Error al obtener los controles:", error.message);
        // Puedes mostrar un mensaje al usuario, registrar el error o realizar otras acciones según tus necesidades.
      }
    },
    async eliminarControl(id) {
      try {
        await axios.delete(`http://localhost:3000/api/eliminar/${id}`);
        this.obtenerControles();
      } catch (error) {
        console.error(
          `Error al eliminar el control con ID ${id}:`,
          error.message
        );
        // Puedes mostrar un mensaje al usuario, registrar el error o realizar otras acciones según tus necesidades.
      }
    },
    initialize() {
      this.controles = [];
      this.obtenerControles();
    },
    crearPdf(data) {
      // Generar el PDF
      const pdf = generarPdf(data);
      // Abre el PDF en una nueva ventana
      pdfMake.createPdf(pdf).open();
    },
    

    mostrarItem(item) {
      this.verIndex = this.controles.indexOf(item);
      this.verItem = Object.assign({}, item);
      this.dialog = true;
    },
    editarItem(item) {
      //Enviar a EditarDoc con el id del item
      this.$router.push({ name: "EditarDoc", params: { id: item._id } });
    },

    deleteItem(item) {
      this.verIndex = this.controles.indexOf(item);
      this.verItem = Object.assign({}, item);
      this.dialogDelete = true;
    },

    deleteItemConfirm() {
      this.eliminarControl(this.verItem._id);
      this.controles.splice(this.verIndex, 1);
      this.closeDelete();
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.verItem = Object.assign({}, this.defaultItem);
        this.verIndex = -1;
      });
    },

    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.verItem = Object.assign({}, this.defaultItem);
        this.verIndex = -1;
      });
    },

    save() {
      if (this.verIndex > -1) {
        Object.assign(this.controles[this.verIndex], this.verItem);
      } else {
        this.controles.push(this.verItem);
      }
      this.close();
    },
  },
};
</script>
