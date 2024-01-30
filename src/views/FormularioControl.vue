<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-shadow" style="padding: 50px">
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

          <v-card-text class="subtitulos" style="margin-top: 20px">
            Hoja de control de pérdida
          </v-card-text>
          <v-card-text class="subtitulos">Fecha: {{ currentDate }}</v-card-text>
          <v-row justify="start">
            <v-select
              v-model="selectedTurno"
              label="Turno"
              :items="['1', '2', '3']"
            ></v-select>
          </v-row>
          <v-row justify="start">
            <v-select
              label="Selecciona tipo"
              v-model="selectedTipo"
              :items="['Caja', 'Lamina', 'Otros']"
            >
            </v-select>
          </v-row>
          <v-row justify="start">
            <v-textarea
              v-model="otrosTipos"
              label="Ingrese otro tipo"
              variant="outlined"
              v-if="selectedTipo === 'Otros'"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="start">
            <v-select
              v-model="selectedArea"
              label="Selecciona area"
              :items="areas"
            >
            </v-select>
          </v-row>
          <v-row justify="start">
            <v-select
              v-model="selectedDefecto"
              label="Selecciona defecto"
              v-if="selectedArea !== ''"
              :items="defectos[selectedAreaIndex] || []"
            ></v-select>
          </v-row>

          <v-row justify="start">
            <v-textarea
              v-model="responsableRechazo"
              label="Responsable del rechazo"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="start">
            <v-textarea
              v-model="numeroOrden"
              label="Número orden"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row style="margin-top: -15px">
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="green-darken-1"
                @click="mostrarAlerta"
                append-icon="mdi-file-plus"
                >Guardar</v-btn
              ></v-col
            >
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="red-darken-1"
                @click="retroceder"
                append-icon="mdi-close-circle-outline"
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
          <v-card-text>Al aceptar se generará un archivo pdf</v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              variant="tonal"
              color="green darken-1"
              text
              @click="enviarControl"
              append-icon="mdi-check-circle-outline"
              >Sí</v-btn
            >
            <v-btn
              variant="tonal"
              color="red darken-1"
              text
              @click="cancelarEnvio"
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
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { generarPdf } from "../utils/crearPdf";
import ErrorDialog from "../components/ErrorDialog.vue";
// Carga las fuentes necesarias para pdfmake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

export default {
  components: {
    ErrorDialog,
  },
  data() {
    return {
      currentDate: new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      selectedArea: "",
      selectedAreaIndex: 0,
      selectedDefecto: "",
      selectedTipo: "",
      tipoGuardar: "",
      otrosTipos: "",
      selectedTurno: "",
      responsableRechazo: "",
      numeroOrden: "",
      orden: {},
      areas: [
        "ATC",
        "ADC",
        "Bodega de rollos",
        "Bodegas externas",
        "Centro de armado",
        "Ceresinadora",
        "Comexi",
        "Despacho",
        "Devolución externa",
        "Diseño & Desarrollo",
        "Eterna",
        "Maquila",
        "Mermas de armado Obsolescencia",
        "Planificación",
        "Rotary corrugadora",
        "Sector Húmedo",
        "Sector Seco corr.",
        "Ventas",
        "Ward 1",
        "Ward 2",
        "Ward 3",
        "Ward 4",
        "Ward 6",
        "HyC2",
        "Voyuan",
        "J&L",
        "Trim",
      ],
      defectos: [
        [
          "Error de ingreso de producto",
          "Producto obsoleto",
          "Producto no corresponde",
        ],
        ["Pruebas BCT", "Ensayo varios"],
        ["Deponche interno", "Daño proveedor", "Obsolescencia"],
        ["Producto dañado", "Producto contaminado", "Obsolescencia"],
        ["Daño mecánico", "Ajuste", "Atascamientos", "Problema de fábrica"],
        ["Problema de fábrica", "Mal ceresinado", "Ojo de pescado", "Otros"],
        ["Desponche saneado", "Pucho"],
        ["Daño mecánico", "Producto contaminado", "Obsolescencia"],
        [
          "Problema de fábrica",
          "Mermas armado",
          "Ajuste N.C.",
          "Error producto",
          "Transporte",
        ],
        [
          "Fuera especificación",
          "Colapso",
          "Error diseño",
          "No cumple requerimiento",
        ],
        ["Mal troquelado", "Daño mecánico", "Atascamientos", "Otros"],
        [
          "Problema de fábrica",
          "Fuera especificación",
          "No cumple requerimiento",
          "Otros",
        ],
        ["Cajas", "Laminas", "Papel", "Otros"],
        [
          "Error de ingreso producto",
          "Producto obsoleto",
          "Producto no corresponde",
          "Fuera especificación",
        ],
        [
          "Cambio programa",
          "Corte de papel",
          "Corte cartón sencillo",
          "Inicio turno",
          "Empalme preimpreso",
          "Defecto de calidad",
          "Otros",
        ],
        ["Desponche", "Pucho", "Puente (cartón sencillo)"],
        [
          "Curvo",
          "Desalineado",
          "Medida erradas",
          "Ampollado",
          "Agalletado",
          "Pliegues",
          "Daño mecánico",
          "Piso / manipulación",
          "Control variables",
          "Otros",
        ],
        [
          "Fuera especificación",
          "Error diseño",
          "No cumple requerimiento",
          "Obsolescencia",
        ],
        ["Problema impresión", "Troquelado", "Set-up", "Atascamiento", "Otros"],
        ["Problema impresión", "Troquelado", "Set-up", "Atascamiento", "Otros"],
        ["Problema impresión", "Troquelado", "Set-up", "Atascamiento", "Otros"],
        ["Problema impresión", "Troquelado", "Set-up", "Atascamiento", "Otros"],
        ["Problema impresión", "Troquelado", "Set-up", "Atascamiento", "Otros"],
        ["Problema impresión", "Troquelado", "Set-up", "Atascamiento", "Otros"],
        ["Descuadre", "Despegado", "Atascamiento", "Daño mecánico"],
        ["Descuadre", "Despegado", "Atascamiento", "Daño mecánico"],
        ["Trim Operativo", "Extra trim", "Trim preimpreso"],
      ],
      mostrarConfirmacion: false,
      mostrarError: false,
      mensajeError: "",
    };
  },
  watch: {
    selectedArea(newSelectedArea) {
      // Actualizar el índice de selectedAreaIndex cuando cambie selectedArea
      this.selectedAreaIndex = this.areas.indexOf(newSelectedArea);
      this.selectedDefecto = "";
    },
  },
  methods: {
    formatFecha(fecha) {
      // Formatea la fecha (cadena ISO 8601) a "DD-MM-YYYY"
      const parts = fecha.split("T")[0].split("-");
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    },
    async obtenerOrden() {
      return axios
        .get(`http://localhost:3000/sql/obtener/${this.numeroOrden}`)
        .then((response) => response.data)
        .catch((error) => {
          console.error(
            `Error al obtener la orden con ID ${this.numeroOrden}:`,
            error.message
          );
          throw error; // Propaga el error
        });
    },
    async enviarControl() {
      try {
        if (this.numeroOrden.trim() === "") {
          this.mostrarError = true;
          this.mensajeError = "Ingrese un número de orden válido.";
          return;
        }

        this.orden = await this.obtenerOrden();

        // Verificar si se ha obtenido la orden correctamente
        if (
          !this.orden ||
          Object.keys(this.orden).length === 0 ||
          !this.orden.CustomerName
        ) {
          this.mostrarError = true;
          this.mensajeError =
            "Error al obtener la orden. Verifique el número de orden ingresado.";
          return;
        }

        if (this.responsableRechazo === "") {
          this.mostrarError = true;
          this.mensajeError = "Ingrese un responsable de rechazo.";
          return;
        }

        if (this.selectedTipo === "Otros") {
          this.mostrarError = true;
          if (this.otrosTipos === "") {
            this.mensajeError = "Ingrese un tipo de desperdicio.";
            return;
          } else {
            this.tipoGuardar = this.otrosTipos;
          }
        }

        if (this.selectedTipo !== "Otros") {
          this.tipoGuardar = this.selectedTipo;
        }

        if (this.selectedArea === "") {
          this.mostrarError = true;
          this.mensajeError = "Ingrese un área.";
          return;
        }

        if (this.selectedDefecto === "") {
          this.mostrarError = true;
          this.mensajeError = "Ingrese un defecto.";
          return;
        }

        let nuevoControl = {
          nroRevision: 1,
          tipo: this.tipoGuardar,
          area: this.selectedArea,
          defecto: this.selectedDefecto,
          turno: parseInt(this.selectedTurno),
          responsable: this.responsableRechazo,
          cliente: this.orden.CustomerName,
          producto: this.orden.ProductDescription,
          cantidad: this.orden.QuantityOrdered,
          nroOp: this.numeroOrden,
          estNumber: this.orden.EstNumber,
        };

        Object.keys(nuevoControl).forEach((key) => {
          if (nuevoControl[key] === undefined) {
            delete nuevoControl[key];
          }
        });

        const nuevoControlConVersiones = {
          versiones: [nuevoControl],
        };
        let res = await axios.post(
          "http://localhost:3000/api/agregar",
          nuevoControlConVersiones
        );

        if (res.status === 201) {
          //formatear res.data.fecha
          const doc = res.data.versiones[0]
          doc.fecha = this.formatFecha(
            doc.fecha
          );
          doc.idAux = res.data.idAux;
          //generar el pdf
          const pdfDefinition = generarPdf(doc);

          // Abre el PDF en una nueva ventana o descárgalo
          pdfMake.createPdf(pdfDefinition).open();
          // Opción para descargar el PDF directamente:
          // pdfMake.createPdf(pdfDefinition).download('nombre_del_archivo.pdf');
          this.$router.push("/");
          this.mensajeError = "Documento creado con éxito.";
          this.mostrarError = true;
        } else {
          this.mensajeError = "Error al enviar el documento 1.";
          this.mostrarError = true;
        }
      } catch (error) {
        this.mensajeError = "Error al enviar el documento 2.";
        this.mostrarError = true;
      } finally {
        this.mostrarConfirmacion = false; // Cerrar la alerta después de enviar
      }
    },
    mostrarAlerta() {
      this.mostrarConfirmacion = true; // Mostrar la alerta al hacer clic en "Enviar control"
    },
    cancelarEnvio() {
      this.mostrarConfirmacion = false; // Cerrar la alerta si se cancela el envío
    },
    retroceder() {
      this.$router.push("/");
    },
    cerrarDialogo() {
      this.mostrarError = false;
    },
  },
};
</script>

<style scoped>
.card-shadow {
  width: 65%;
  padding: 30px;
  border-radius: 30px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.35);
}

.subtitulos {
  text-align: center;
  margin-bottom: -10px;
}
</style>
