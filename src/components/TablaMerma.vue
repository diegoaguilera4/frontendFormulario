<template>
  <v-row style="margin-top: 20px; margin-left: 5px; margin-right: 5px">
    <v-col>
      <v-text-field
        v-model="search"
        label="Buscar"
        solo-inverted
        clearable
        @click:clear="clearSearch"
        append-inner-icon="mdi-magnify"
      ></v-text-field>
    </v-col>

    <v-col>
      <VueDatePicker
        v-model="filtroFecha"
        locale="es"
        format="dd/MM/yyyy"
        cancelText="CANCELAR"
        selectText="SELECCIONAR"
        :enable-time-picker="false"
        range
        placeholder="Filtrar por rango de fechas"
        :partial-range="true"
      />
    </v-col>
  </v-row>
  <v-data-table
    :headers="headers"
    :items="filteredMermas"
    style="margin-top: 20px; text-align: left"
    items-per-page-text="Documentos por página"
    page-text="{0}-{1} de {2}"
  >
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Documentos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn
          color="green darken-3"
          variant="elevated"
          append-icon="mdi-file-excel-outline"
          style="margin-right: 10px"
          @click="exportarExcel()"
        >
          Exportar
        </v-btn>
        <v-btn
          variant="tonal"
          append-icon="mdi-plus-circle"
          @click="irNuevaMerma()"
        >
          Ingresar Merma
        </v-btn>
        <v-dialog v-model="dialogDelete" max-width="600px">
          <v-card
            class="text-center"
            style="border-radius: 20px; padding: 15px"
          >
            <v-card-title class="text-h5"
              >¿Estás seguro que deseas eliminar esta merma?</v-card-title
            >
            <v-row>
              <v-card-text>
                patente: {{ editedItem.patenteCamion }} empresa:
                {{ editedItem.empresaEnvia }} kilos: {{ editedItem.kilos }}
              </v-card-text>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue-darken-1"
                variant="tonal"
                @click="closeDelete"
                append-icon="mdi-close-circle-outline"
                >Cancelar</v-btn
              >
              <v-btn
                color="red-darken-1"
                variant="tonal"
                @click="deleteItemConfirm"
                append-icon="mdi-delete"
                >Eliminar</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:[`item.actions`]="{ item }">
      <v-icon size="small" class="me-2" @click="editarItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon size="small" @click="deleteItem(item)"> mdi-delete </v-icon>
    </template>
    <template v-slot:no-data>
      <p>No existen resultados</p>
    </template>
  </v-data-table>
  <v-dialog v-model="noHayDatos" max-width="500px">
    <v-card style="border-radius: 20px; padding: 10px">
      <v-card-title class="text-center"> Error exportando</v-card-title>
      <v-card-text>
        <p>
          No se puede exportar a Excel porque no hay datos que cumplan con los
          filtros seleccionados.
        </p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn variant="tonal" @click="noHayDatos = false"> Cerrar </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generarPdf } from "../utils/crearPdf";
import { ref } from "vue";
import * as XLSX from "xlsx";

// Carga las fuentes necesarias para pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;
export default {
  data: () => ({
    search: "",
    dialog: false,
    dialogDelete: false,
    noHayDatos: false,
    headers: [
      { key: "_id", title: "id" },
      { key: "nombre", title: "nombre" },
      { key: "rut", title: "rut" },
      { key: "fecha", title: "Fecha" },
      { key: "patenteCamion", title: "Patente camión" },
      { key: "empresaEnvia", title: "Empresa" },
      { key: "kilos", title: "Kilos" },
      { title: "Acciones", key: "actions", sortable: false },
    ],
    mermas: [],
    verIndex: -1,
    verItem: {
      _id: "",
      nombre: "",
      rut: "",
      fecha: "",
      patenteCamion: "",
      empresaEnvia: "",
      kilos: "",
    },
    editedIndex: -1,
    editedItem: {
      _id: "",
      nombre: "",
      rut: "",
      fecha: "",
      patenteCamion: "",
      empresaEnvia: "",
      kilos: "",
    },
    defaultItem: {
      _id: "",
      nombre: "",
      rut: "",
      fecha: "",
      patenteCamion: "",
      empresaEnvia: "",
      kilos: "",
    },
    areaFilter: null,
    turnoFilter: null,
    responsableFilter: null,
    selectedDate: null,
    showDatePicker: false,
    filtroFecha: new ref(),
  }),

  computed: {
    filteredMermas() {
      const filtroFechaProxy = this.filtroFecha;
      // Verificar si filtroFechaProxy está definido
      if (filtroFechaProxy) {
        const fecha1 = filtroFechaProxy[0];
        const fecha2 = filtroFechaProxy[1];
        fecha1.setHours(0, 0, 0, 0);
        fecha2.setHours(23, 59, 59, 999);
        return this.mermas.filter((item) => {
          //transformar item.date de dd-mm-yyyy a mm-dd-yyyy
          const [day, month, year] = item.fecha.split("-");
          const itemDate = new Date(`${month}-${day}-${year}`);
          return (
            (this.searchFilter(item) || this.search === "") &&
            itemDate >= fecha1 &&
            itemDate <= fecha2
          );
        });
      } else {
        return this.mermas.filter((item) => {
          return this.searchFilter(item) || this.search === "";
        });
      }
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
  },

  methods: {
    getUniqueValues(columnKey) {
      const uniqueValues = new Set();
      this.filteredMermas.forEach((item) => {
        if (item[columnKey]) {
          uniqueValues.add(item[columnKey]);
        }
      });
      return Array.from(uniqueValues);
    },
    searchFilter(item) {
      return Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(this.search.toLowerCase())
      );
    },
    toggleDatePicker() {
      this.showDatePicker = !this.showDatePicker;
    },
    clearSearch() {
      this.search = "";
    },
    irNuevaMerma() {
      // Puedes redirigir a la ruta del formulario aquí, por ejemplo:
      this.$router.push("/nuevaMerma");
    },
    formatFecha(fecha) {
      const [year, month, day] = new Date(fecha)
        .toISOString()
        .slice(0, 10)
        .split("-");
      return `${day}-${month}-${year}`;
    },
    async obtenerMermas() {
      try {
        const response = await axios.get(
          "http://localhost:3000/merma/obtenerTodos"
        );
        // Verificar si la respuesta tiene datos
        if (response.data) {
          this.mermas = response.data;
          this.mermas.forEach((merma) => {
            merma.fecha = this.formatFecha(merma.fecha);
            merma.nombre = merma.persona.nombre;
            merma.rut = merma.persona.rut;
          });
        } else {
          console.error("La respuesta no contiene datos válidos.");
          // Puedes lanzar una excepción personalizada o manejarla según tus necesidades.
        }
      } catch (error) {
        console.error("Error al obtener las mermas", error.message);
        // Puedes mostrar un mensaje al usuario, registrar el error o realizar otras acciones según tus necesidades.
      }
    },
    async eliminarMerma() {
      try {
        const response = await axios.delete(
          `http://localhost:3000/merma/eliminar/${this.editedItem._id}`
        );
        if (response.status === 200) {
          console.log("Merma eliminada");
        } else {
          console.error("Error al eliminar la merma");
        }
      } catch (error) {
        console.error("Error al eliminar la merma:", error.message);
      }
    },
    initialize() {
      this.mermas = [];
      this.obtenerMermas();
    },
    crearPdf(data) {
      // Generar el PDF
      const pdf = generarPdf(data);
      // Abre el PDF en una nueva ventana
      pdfMake.createPdf(pdf).open();
    },
    editarItem(item) {
      //Enviar a editarMerma con el id
      this.$router.push(`/editarMerma/${item._id}`);
    },
    deleteItem(item) {
      this.editedIndex = this.mermas.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      this.mermas.splice(this.editedIndex, 1);
      this.eliminarMerma();
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
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
    save() {
      if (this.verIndex > -1) {
        Object.assign(this.mermas[this.verIndex], this.verItem);
      } else {
        this.mermas.push(this.verItem);
      }
      this.close();
    },
    exportarExcel() {
      //verificar que filteredRegistros tenga datos
      if (this.filteredMermas.length > 0) {
        const worksheet = XLSX.utils.json_to_sheet(this.filteredMermas);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Mermas");
        XLSX.writeFile(workbook, "Mermas.xlsx");
      } else {
        this.noHayDatos = true;
      }
    },
  },
};
</script>

<style>
.dp__theme_light {
  --dp-background-color: #f5f5f5;
  --dp-text-color: #000000;
  --dp-hover-color: #d7e1ea;
  --dp-hover-text-color: #212121;
  --dp-hover-icon-color: #959595;
  --dp-primary-color: #3f8ad5;
  --dp-primary-disabled-color: #6bacea;
  --dp-primary-text-color: #ffffff;
  --dp-secondary-color: #919090;
  --dp-border-color: #efefef;
  --dp-menu-border-color: #ddd;
  --dp-border-color-hover: #aaaeb7;
  --dp-disabled-color: #f6f6f6;
  --dp-scroll-bar-background: #f3f3f3;
  --dp-scroll-bar-color: #959595;
  --dp-success-color: #76d275;
  --dp-success-color-disabled: #a3d9b1;
  --dp-icon-color: #636363;
  --dp-danger-color: #ff6f60;
  --dp-marker-color: #ff6f60;
  --dp-tooltip-color: #fafafa;
  --dp-disabled-color-text: #8e8e8e;
  --dp-highlight-color: rgb(25 118 210 / 10%);
  --dp-range-between-dates-background-color: var(--dp-hover-color, #f3f3f3);
  --dp-range-between-dates-text-color: var(--dp-hover-text-color, #212121);
  --dp-range-between-border-color: var(--dp-hover-color, #f3f3f3);
}

:root {
  /* General */
  --dp-font-family: roboto;
  --dp-border-radius: 0px; /* Radio de borde configurable */
  --dp-cell-border-radius: 10px; /* Radio de borde específico para la celda del calendario */
  --dp-common-transition: all 0.1s ease-in; /* Transición genérica aplicada a botones y celdas del calendario */

  /* Tamaños */
  --dp-button-height: 35px; /* Tamaño para botones en superposiciones */
  --dp-month-year-row-height: 35px; /* Altura de la fila de selección de mes-año */
  --dp-month-year-row-button-size: 35px; /* Altura específica para los botones siguiente/anterior */
  --dp-button-icon-height: 20px; /* Tamaño de icono en botones */
  --dp-cell-size: 40px; /* Ancho y alto de la celda del calendario */
  --dp-cell-padding: 5px; /* Relleno en la celda */
  --dp-common-padding: 10px; /* Relleno común utilizado */
  --dp-input-icon-padding: 35px; /* Relleno en el lado izquierdo del campo de entrada si hay un icono presente */
  --dp-input-padding: 6px 30px 6px 12px; /* Relleno en el campo de entrada */
  --dp-menu-min-width: 345px; /* Ajustar el ancho mínimo del menú */
  --dp-action-buttons-padding: 2px 5px; /* Ajustar el relleno para los botones de acción en la fila de acciones */
  --dp-row-margin: 5px 0; /* Ajustar el espacio entre filas en el calendario */
  --dp-calendar-header-cell-padding: 0.5rem; /* Ajustar el relleno en las celdas de encabezado del calendario */
  --dp-two-calendars-spacing: 10px; /* Espacio entre varios calendarios */
  --dp-overlay-col-padding: 3px; /* Relleno en la columna de superposición */
  --dp-time-inc-dec-button-size: 32px; /* Tamaño para botones de incremento/decremento en el selector de tiempo */
  --dp-menu-padding: 6px 8px; /* Relleno del menú */

  /* Tamaños de fuente */
  --dp-font-size: 1rem; /* Tamaño de fuente predeterminado */
  --dp-preview-font-size: 0.8rem; /* Tamaño de fuente de la vista previa de la fecha en la fila de acciones */
  --dp-time-font-size: 0.8rem; /* Tamaño de fuente en el selector de tiempo */

  /* Transiciones */
  --dp-animation-duration: 0.1s; /* Duración de la transición */
  --dp-menu-appear-transition-timing: cubic-bezier(
    0.4,
    0,
    1,
    1
  ); /* Temporización en la animación de aparición del menú */
  --dp-transition-timing: ease-out; /* Temporización en las animaciones de deslizamiento */
}
</style>
