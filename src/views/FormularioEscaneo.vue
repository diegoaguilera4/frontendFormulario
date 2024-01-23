<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-grande">
          <v-card-title
            class="text-h6 text-md-h5 text-lg-h4 text-center"
            style="
              background-color: #d90000;
              color: #ffffff;
              border-radius: 20px;
            "
          >
            Control de desperdicio
          </v-card-title>
          <v-row style="margin-top: 20px; ">
            <v-col>
              <v-card-text class="subtitulos">
                N° revisión: {{ documento.nroRevision }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Área: {{ documento.area }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Turno: {{ documento.turno }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Responsable: {{ documento.responsable }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Fecha: {{ documento.fecha }}</v-card-text
              >
            </v-col>
            <v-col align-self="center">
              <v-card-text class="subtitulos">
                N° Op: {{ documento.nroOp }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Código: {{ documento.estNumber }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Producto: {{ documento.producto }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Cliente: {{ documento.cliente }}</v-card-text
              >
              <v-card-text v-if="documento.totalKilos" class="subtitulos">
                Kilos: {{ documento.totalKilos }}</v-card-text
              >
            </v-col>
          </v-row>
          <v-row justify="center" style="margin-bottom:10px">
            <v-btn
                color="black"
                variant="tonal"
                @click="crearPdf(documento)"
              >
                <v-icon left color="red"> mdi-file-pdf </v-icon>
                Ver PDF
              </v-btn>
          </v-row>

          <v-row justify="center">
            <v-textarea
              label="Nuevo formulario 1"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="center">
            <v-textarea
              label="Nuevo formulario 2"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-col
              ><v-btn variant="tonal" block class="mt-2" color="green-darken-1" append-icon="mdi-content-save"
                >Guardar</v-btn
              ></v-col
            >
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="red-darken-1"
                @click="$router.push('/escanear')"
                append-icon="mdi-arrow-left-bold-circle-outline"
                >Cancelar</v-btn
              ></v-col
            >
          </v-row>
        </v-card>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";
import { generarPdf } from "../utils/crearPdf";
import pdfMake from "pdfmake/build/pdfmake";

export default {
  data() {
    return {
      id: "",
      orden: {},
      documento: {},
      numeroOrden: "",
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    // Realiza acciones con el ID, por ejemplo, llama a obtenerDoc con el ID
    this.obtenerDoc(this.id);
  },
  methods: {
    async obtenerDoc(id) {
      try {
        let res = await axios.get(`http://localhost:3000/api/obtener/${id}`);
        this.documento = res.data;
        this.documento.fecha = this.formatearFecha(this.documento.fecha);
      } catch (error) {
        console.error(
          `Error al obtener el control con ID ${id}:`,
          error.message
        );
      }
    },
    crearPdf(data) {
      // Generar el PDF
      const pdf = generarPdf(data);
      // Abre el PDF en una nueva ventana
      pdfMake.createPdf(pdf).open();
    },
    formatearFecha(fecha) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const fechaFormateada = new Date(fecha).toLocaleDateString(
        "es-ES",
        options
      );
      return fechaFormateada;
    },
    async obtenerOrden() {
      try {
        let res = await axios.get(
          `http://localhost:3000/sql/obtener/${this.numeroOrden}`
        );
        this.orden = res.data;
      } catch (error) {
        console.error(
          `Error al obtener la orden con ID ${this.numeroOrden}:`,
          error.message
        );
      }
    },
  },
};
</script>

<style scoped>
.card-grande {
  width: 65%;
  padding: 30px;
  border-radius: 5%;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.35);
}

.card-orden {
  border: none;
  box-shadow: none;
  padding: 10px;
}

.subtitulos {
  margin-bottom: -13px;
  text-align: center;
}
</style>
