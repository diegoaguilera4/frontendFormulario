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
          <v-row justify="start" style="margin-top: 20px">
            <v-combobox
              v-model="selectedArea"
              label="Area"
              :items="areas"
              variant="outlined"
            ></v-combobox>
          </v-row>

          <v-row justify="start" v-if="selectedArea === 'Otra'">
            <v-textarea
              v-model="selectedAreaOtra"
              label="Otra"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>

          <v-row justify="start">
            <v-combobox
              v-model="selectedTurno"
              label="Turno"
              :items="['1', '2', '3']"
              variant="outlined"
            ></v-combobox>
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
            <v-combobox
              v-model="selectedDefectoLamina"
              label="Defecto en lamina"
              :items="defectosLamina"
              variant="outlined"
            ></v-combobox>
          </v-row>

          <v-row justify="start" v-if="selectedDefectoLamina === 'Otros'">
            <v-textarea
              v-model="selectedDefectoLaminaOtros"
              label="Otros"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>

          <v-row justify="start">
            <v-combobox
              v-if="
                selectedDefectoLamina !== 'Ningún defecto' &&
                selectedDefectoLamina !== ''
              "
              v-model="selectedCausaLamina"
              label="Causa de defecto en lamina"
              :items="causasLamina"
              variant="outlined"
            ></v-combobox>
          </v-row>

          <v-row justify="start">
            <v-combobox
              v-model="selectedDefectoCaja"
              label="Defecto en caja"
              :items="defectoCaja"
              variant="outlined"
            ></v-combobox>
          </v-row>

          <v-row justify="start" v-if="selectedDefectoCaja === 'Otros'">
            <v-textarea
              v-model="selectedDefectoCajaOtros"
              label="Otros"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>

          <v-row justify="start">
            <v-combobox
              v-if="
                selectedDefectoCaja !== 'Ningún defecto' &&
                selectedDefectoCaja !== ''
              "
              v-model="selectedCausaCaja"
              label="Causa de defecto en caja"
              :items="causaCaja"
              variant="outlined"
            ></v-combobox>
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
          <v-row>
            <v-checkbox
              v-model="checkbox"
              style="margin-top: -15px; margin-bottom: -15px"
            >
              <template v-slot:label>
                <span>Marcar peso</span>
                <v-icon>mdi-weight-kilogram</v-icon>
              </template>
            </v-checkbox>
          </v-row>
          <v-row justify="start">
            <v-textarea
              v-if="checkbox"
              v-model="totalKilos"
              label="Total kilos"
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
      selectedAreaOtra: "",
      selectedTurno: "",
      responsableRechazo: "",
      selectedDefectoLamina: "",
      selectedDefectoLaminaOtros: "",
      selectedCausaLamina: "",
      selectedDefectoCaja: "",
      selectedDefectoCajaOtros: "",
      selectedCausaCaja: "",
      numeroOrden: "",
      totalKilos: "",
      checkbox: false,
      orden: {},
      areas: [
        "corrugadora",
        "ward1",
        "ward2",
        "w3",
        "w4",
        "w6",
        "hy-cor",
        "j&l",
        "planificación",
        "perdida arm.",
        "desarrollo",
        "ventas",
        "despacho",
        "cerecinado",
        "maquila",
        "laboratorio",
        "desponche",
        "plástico",
        "Otra",
      ],
      defectosLamina: [
        "Ningún defecto",
        "Curvo",
        "Despegado",
        "Desalineado",
        "Medida errada",
        "Largo y corto",
        "Excedentes",
        "Pliegues",
        "Onda saltada",
        "Daño mecanico",
        "Manejo",
        "Otros",
      ],
      causasLamina: [
        "Baja Velocidad",
        "Empalmes",
        "Corte de papel",
        "Poca aplicación",
        "Secado de colero",
        "Exceso de temperatura",
        "Falta de temperatura",
        "Raya en mesa",
        "Limitadores",
        "Poco trim",
        "Diferencia de formato",
        "Problema de papel",
        "Cambio de lista",
        "Reprogragmaciones",
        "Operacional",
        "Cuchillos",
        "Falla mecánica",
        "Falla eléctrica",
        "Ensayos",
        "Exceso de Humedad Papel",
      ],
      defectoCaja: [
        "Ningún defecto",
        "Problemas de impresión",
        "Tranconces",
        "Troquel",
        "Set-up",
        "Gap/Descuadre",
        "Rayado partido",
        "Otros",
      ],
      causaCaja: [
        "Falta de tinta",
        "Cartón húmedo",
        "Cartón absorbente",
        "Falta de presión anillos",
        "Tinta no da tono",
        "Problemas de ????",
        "Falta de presión impresor",
        "Placas dobladas",
        "Deslaminado???",
        "Problema eléctrico",
        "Problema mecánico",
        "Placas agalletadas???",
        "Cartón curvo",
        "Desarrollo de producto",
        "Primeras cajas",
        "Operacional",
        "Problema de matriz",
        "Ensayos",
      ],
      mostrarConfirmacion: false,
      mostrarError: false,
      mensajeError: "",
    };
  },
  watch: {
    // Observar cambios en selectedDefectoLamina
    selectedDefectoLamina(newDefecto) {
      if (newDefecto === "Ningún defecto") {
        this.selectedCausaLamina = ""; // Reiniciar la variable
      }
    },
    // Observar cambios en selectedDefectoCaja
    selectedDefectoCaja(newDefecto) {
      if (newDefecto === "Ningún defecto") {
        this.selectedCausaCaja = ""; // Reiniciar la variable
      }
    },
  },
  methods: {
    validarSeleccion(lista, valor) {
      // Validar que el valor esté presente en la lista
      return lista.includes(valor);
    },
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

        if (!this.validarSeleccion(this.areas, this.selectedArea)) {
          this.mostrarError = true;
          this.mensajeError = "Área seleccionada no válida.";
          return;
        }

        if (!this.validarSeleccion(["1", "2", "3"], this.selectedTurno)) {
          this.mostrarError = true;
          this.mensajeError = "Turno seleccionado no válido.";
          return;
        }

        if (this.responsableRechazo === "") {
          this.mostrarError = true;
          this.mensajeError = "Ingrese un responsable de rechazo.";
          return;
        }

        if (
          !this.validarSeleccion(
            this.defectosLamina,
            this.selectedDefectoLamina
          )
        ) {
          this.mostrarError = true;
          this.mensajeError = "Defecto en lámina seleccionado no válido.";
          return;
        }

        if (
          this.selectedDefectoLamina === "Otros" &&
          !this.selectedDefectoLaminaOtros.trim()
        ) {
          this.mostrarError = true;
          this.mensajeError =
            "Ingrese detalles para 'Otros' en defecto en lámina.";
          return;
        }

        // Validar la causa solo si el defecto no es "Ningún defecto"
        if (
          this.selectedDefectoLamina !== "Ningún defecto" &&
          !this.validarSeleccion(this.causasLamina, this.selectedCausaLamina)
        ) {
          this.mostrarError = true;
          this.mensajeError =
            "Causa de defecto en lámina seleccionada no válida.";
          return;
        }

        if (
          !this.validarSeleccion(this.defectoCaja, this.selectedDefectoCaja)
        ) {
          this.mostrarError = true;
          this.mensajeError = "Defecto en caja seleccionado no válido.";
          return;
        }

        if (
          this.selectedDefectoCaja === "Otros" &&
          !this.selectedDefectoCajaOtros.trim()
        ) {
          this.mostrarError = true;
          this.mensajeError =
            "Ingrese detalles para 'Otros' en defecto en caja.";
          return;
        }

        // Validar la causa solo si el defecto no es "Ningún defecto"
        if (
          this.selectedDefectoCaja !== "Ningún defecto" &&
          !this.validarSeleccion(this.causaCaja, this.selectedCausaCaja)
        ) {
          this.mostrarError = true;
          this.mensajeError =
            "Causa de defecto en caja seleccionada no válida.";
          return;
        }

        var kilosTrue = false;

        if (this.checkbox === true) {
          if (this.totalKilos === "") {
            this.mostrarError = true;
            this.mensajeError = "Ingrese un total de kilos.";
            return;
          } else if (isNaN(this.totalKilos)) {
            this.mostrarError = true;
            this.mensajeError = "Ingrese un total de kilos válido.";
            return;
          } else {
            kilosTrue = true;
          }
        }

        let nuevoControl = {
          nroRevision: 1,
          area: this.selectedArea,
          areaOtra:
            this.selectedArea === "Otra" ? this.selectedAreaOtra : undefined,
          turno: parseInt(this.selectedTurno),
          responsable: this.responsableRechazo,
          defectoEnLamina: this.selectedDefectoLamina,
          defectoEnLaminaOtros: this.selectedDefectoLaminaOtros,
          causaLamina:
            this.selectedDefectoLamina !== "Ningún defecto"
              ? this.selectedCausaLamina
              : undefined,
          defectoEnCaja: this.selectedDefectoCaja,
          defectoEnCajaOtros: this.selectedDefectoCajaOtros,
          causaCaja:
            this.selectedDefectoCaja !== "Ningún defecto"
              ? this.selectedCausaCaja
              : undefined,
          cliente: this.orden.CustomerName,
          producto: this.orden.ProductDescription,
          cantidad: this.orden.QuantityOrdered,
          nroOp: this.numeroOrden,
          estNumber: this.orden.EstNumber,
        };

        if (kilosTrue) {
          nuevoControl.totalKilos = this.totalKilos;
        }

        Object.keys(nuevoControl).forEach((key) => {
          if (nuevoControl[key] === undefined) {
            delete nuevoControl[key];
          }
        });

        let res = await axios.post(
          "http://localhost:3000/api/agregar",
          nuevoControl
        );

        if (res.status === 201) {
          //formatear res.data.fecha
          res.data.fecha = this.formatFecha(res.data.fecha);
          //generar el pdf
          const pdfDefinition = generarPdf(res.data);

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
        console.log(error);
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
