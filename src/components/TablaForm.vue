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
      <v-select
        v-model="areaFilter"
        clearable
        chips
        label="Filtrar por área"
        :items="getUniqueValues('area')"
        append-inner-icon="mdi-domain"
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        v-model="turnoFilter"
        clearable
        chips
        label="Filtrar por turno"
        :items="getUniqueValues('turno')"
        append-inner-icon="mdi-clock-time-four"
      ></v-select>
    </v-col>
    <v-col>
      <v-select
        v-model="responsableFilter"
        clearable
        chips
        label="Filtrar por responsable"
        :items="getUniqueValues('responsable')"
        append-inner-icon="mdi-account"
      ></v-select>
    </v-col>

    <v-col>
      <VueDatePicker
        v-model="filtroFecha"
        locale="es"
        format="dd/MM/yyyy"
        cancelText="Cancelar"
        selectText="Seleccionar"
        :enable-time-picker="false"
        range
        :partial-range="true"
      />
    </v-col>
  </v-row>
  <v-data-table
    :headers="headers"
    :items="filteredControles"
    style="margin-top: 20px; text-align: left"
    items-per-page-text="Documentos por página"
    page-text="{0}-{1} de {2}"
  >
    
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Documentos</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-btn
          variant="tonal"
          append-icon="mdi-plus-circle"
          @click="irNuevoDoc()"
        >
          Crear documento
        </v-btn>

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
                <v-row v-if="!verItem.areaOtra">
                  <p>Área: {{ verItem.area }}</p>
                </v-row>
                <v-row v-if="verItem.areaOtra">
                  <p>Área: {{ verItem.areaOtra }} (Otra)</p>
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
                <v-row v-if="!verItem.defectoEnLaminaOtros">
                  <p>Defecto en lamina: {{ verItem.defectoEnLamina }}</p>
                </v-row>
                <v-row v-if="verItem.defectoEnLaminaOtros">
                  <p>
                    Defecto en lamina:
                    {{ verItem.defectoEnLaminaOtros }} (Otros)
                  </p>
                </v-row>
                <v-row v-if="verItem.defectoEnLamina !== 'Ningún defecto'">
                  <p>Causa lamina: {{ verItem.causaLamina }}</p>
                </v-row>
                <v-row v-if="!verItem.defectoEnCajaOtros">
                  <p>Defecto en caja: {{ verItem.defectoEnCaja }}</p>
                </v-row>
                <v-row v-if="verItem.defectoEnCajaOtros">
                  <p>
                    Defecto en caja: {{ verItem.defectoEnCajaOtros }} (Otros)
                  </p>
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
      <p>No existen resultados</p>
    </template>
  </v-data-table>
</template>

<script>
import axios from "axios";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generarPdf } from "../utils/crearPdf";
import { ref } from "vue";

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
      {
        key: "fecha",
        title: "Fecha",
        sortBy: (a, b) => new Date(b) - new Date(a),
      },
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
    areaFilter: null,
    turnoFilter: null,
    responsableFilter: null,
    selectedDate: null,
    showDatePicker: false,
    filtroFecha: new ref(),
  }),

  computed: {
    filteredControles() {
      const filtroFechaProxy = this.filtroFecha;
      // Verificar si filtroFechaProxy está definido
      if (filtroFechaProxy) {
        const fecha1 = filtroFechaProxy[0];
        const fecha2 = filtroFechaProxy[1];
        fecha1.setHours(0, 0, 0, 0);
        fecha2.setHours(23, 59, 59, 999);
        return this.controles.filter((item) => {
          //transformar item.date de dd-mm-yyyy a mm-dd-yyyy
          const [day, month, year] = item.fecha.split("-");
          const itemDate = new Date(`${month}-${day}-${year}`);
          return (
            (this.searchFilter(item) || this.search === "") &&
            (this.areaFilter === null ||
              this.areaFilter === "" ||
              item.area === this.areaFilter) &&
            (this.turnoFilter === null ||
              this.turnoFilter === "" ||
              item.turno === this.turnoFilter) &&
            (this.responsableFilter === null ||
              this.responsableFilter === "" ||
              item.responsable === this.responsableFilter) &&
            itemDate >= fecha1 &&
            itemDate <= fecha2
          );
        });
      } else {
        return this.controles.filter((item) => {
          return (
            (this.searchFilter(item) || this.search === "") &&
            (this.areaFilter === null ||
              this.areaFilter === "" ||
              item.area === this.areaFilter) &&
            (this.turnoFilter === null ||
              this.turnoFilter === "" ||
              item.turno === this.turnoFilter) &&
            (this.responsableFilter === null ||
              this.responsableFilter === "" ||
              item.responsable === this.responsableFilter)
          );
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
    this.obtenerControles();
  },

  methods: {
    getUniqueValues(columnKey) {
      const uniqueValues = new Set();
      this.filteredControles.forEach((item) => {
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
    irNuevoDoc() {
      // Puedes redirigir a la ruta del formulario aquí, por ejemplo:
      this.$router.push("/nuevoDocumento");
    },
    formatFecha(fecha) {
      const [year, month, day] = new Date(fecha)
        .toISOString()
        .slice(0, 10)
        .split("-");
      return `${day}-${month}-${year}`;
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

<style scoped></style>
