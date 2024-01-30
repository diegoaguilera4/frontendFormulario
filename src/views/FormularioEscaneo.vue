<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-grande">
          <v-card-title
            class="text-h6 text-md-h5 text-lg-h4 text-center"
            style="
              background-color: #126aa3;
              color: #ffffff;
              border-radius: 20px;
            "
          >
            Control picadora
          </v-card-title>
          <v-row style="margin-top: 20px">
            <v-col>
              <v-card-text class="subtitulos">
                N° revisión: {{ documento.nroRevision }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Turno: {{ documento.turno }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Tipo: {{ documento.tipo }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Área: {{ documento.area }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Causa: {{ documento.causa }}</v-card-text
              >
              <v-card-text class="subtitulos">
                Responsable: {{ documento.responsable }}</v-card-text
              >
            </v-col>
            <v-col align-self="center">
              <v-card-text class="subtitulos">
                Fecha: {{ documento.fecha }}</v-card-text
              >
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
              <v-card-text class="subtitulos">
                Cantidad: {{ documento.cantidad }}</v-card-text
              >
            </v-col>
          </v-row>
          <v-row justify="center" style="margin-bottom: 10px">
            <v-btn color="black" variant="tonal" @click="crearPdf(documento)">
              <v-icon left color="red"> mdi-file-pdf </v-icon>
              Ver PDF
            </v-btn>
          </v-row>
          <v-row justify="center">
            <v-textarea
              v-model="persona"
              label="Persona"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="start">
            <v-select
              v-model="selectedTurno"
              label="Turno"
              :items="['1', '2', '3']"
            ></v-select>
          </v-row>
          <v-row justify="center">
            <v-textarea
              v-model="totalKilos"
              label="Total kilos"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="green-darken-1"
                append-icon="mdi-content-save"
                @click="mostrarAlerta()"
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
      <v-dialog v-model="mostrarConfirmacion" max-width="500">
        <v-card class="text-center" style="border-radius: 20px; padding: 10px">
          <v-card-title class="headline">Confirmación</v-card-title>
          <v-card-text
            >¿Estás seguro de que quieres enviar este control?</v-card-text
          >
          <v-card-actions class="justify-center">
            <v-btn
              variant="tonal"
              color="green darken-1"
              text
              @click="crearControlPicadora()"
              append-icon="mdi-check-circle-outline"
              >Sí</v-btn
            >
            <v-btn
              variant="tonal"
              color="red darken-1"
              text
              @click="cancelarEnvio()"
              append-icon="mdi-close-circle-outline"
              >Cancelar</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>
      <error-dialog
        :mostrarError="mostrarError"
        :mensajeError="mensajeError"
        @cerrar-dialogo="cerrarDialogo"
      />
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";
import { generarPdf } from "../utils/crearPdf";
import pdfMake from "pdfmake/build/pdfmake";
import ErrorDialog from "../components/ErrorDialog.vue";

export default {
  components: {
    ErrorDialog,
  },
  data() {
    return {
      id: "",
      idAux: "",
      idPadre: "",
      orden: {},
      documento: {},
      numeroOrden: "",
      persona: "",
      selectedTurno: "",
      totalKilos: "",
      mostrarError: false,
      mensajeError: "",
      mostrarConfirmacion: false,
    };
  },
  mounted() {
    this.idAux = this.$route.params.idAux;
    // Realiza acciones con el ID, por ejemplo, llama a obtenerDoc con el ID
    this.obtenerDoc(this.idAux);
  },
  methods: {
    async obtenerDoc(id) {
      try {
        let res = await axios.get(
          `http://localhost:3000/api/obtenerPorIdAux/${id}/`
        );
        this.documento = res.data.version;
        this.idAux = res.data.idAux;
        this.idPadre = res.data.id;
        this.documento.fecha = this.formatearFecha(this.documento.fecha);
      } catch (error) {
        console.error(
          `Error al obtener el control con ID ${id}:`,
          error.message
        );
      }
    },
    async crearControlPicadora() {
      try {
        const nuevoControlPicadora = {
          desperdicio: this.idPadre,
          persona: this.persona,
          turno: this.selectedTurno,
          kilos: this.totalKilos,
        };
        if (this.persona.length === 0) {
          this.mensajeError = "Debe ingresar una persona";
          this.mostrarError = true;
          return;
        }
        if (this.selectedTurno.length === 0) {
          this.mensajeError = "Debe ingresar un turno";
          this.mostrarError = true;
          return;
        }
        //validar que kilos sea un numero y no string
        if (this.totalKilos.length === 0 || isNaN(this.totalKilos)) {
          this.mensajeError = "Debe ingresar un número válido en totalKilos";
          this.mostrarError = true;
          return;
        }
        let res = await axios.post(
          "http://localhost:3000/controlPicadora/agregar",
          nuevoControlPicadora
        );
        if (res.status === 201) {
          let res2 = await axios.put(
            `http://localhost:3000/api/actualizarId/${this.idPadre}`,
            {
              picado: true,
            }
          );
          if (res2.status === 200) {
            console.log("Documento actualizado correctamente");
          } else {
            console.error("Error al actualizar el documento");
          }
          this.$router.push("/");
        } else {
          console.error("Error al crear el control picadora");
        }
      } catch (error) {
        console.error(`Error al enviar control:`, error.message);
      }
    },
    crearPdf(data) {
      const doc = data;
      doc.idAux = this.idAux;
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
    mostrarAlerta() {
      this.mostrarConfirmacion = true; // Mostrar la alerta al hacer clic en "Enviar control"
    },
    cancelarEnvio() {
      this.mostrarConfirmacion = false; // Cerrar la alerta si se cancela el envío
    },
    cerrarDialogo() {
      this.mostrarError = false;
      this.mostrarConfirmacion = false;
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
