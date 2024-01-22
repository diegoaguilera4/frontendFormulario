<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-shadow">
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
            Revisión N°: {{ nroRevisionActual }}
          </v-card-text>
          <v-card-text class="subtitulos">Fecha: {{ fechaDoc }}</v-card-text>
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
              v-if="totalKilos"
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
                append-icon="mdi-update"
                @click="mostrarAlerta"
                >Actualizar</v-btn
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
            >¿Estás seguro de que quieres actualizar este control?</v-card-text
          >
          <v-card-text>Al aceptar se generará un nuevo archivo pdf</v-card-text>
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
      id: "",
      nroRevisionActual: "",
      fechaDoc: "",
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
      totalKilos: "",
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
  mounted() {
    this.id = this.$route.params.id;
    // Realiza acciones con el ID, por ejemplo, llama a obtenerDoc con el ID
    this.obtenerDoc(this.id);
  },
  methods: {
    validarSeleccion(lista, valor) {
      // Validar que el valor esté presente en la lista
      return lista.includes(valor);
    },
    async enviarControl() {
      try {
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

        if (this.totalKilos) {
          if (this.totalKilos === "" || isNaN(this.totalKilos)) {
            this.mostrarError = true;
            this.mensajeError = "Ingrese un total de kilos válido.";
            return;
          }
        }

        let nuevoControl = {
          nroRevision: this.nroRevisionActual + 1,
          area: this.selectedArea,
          areaOtra: this.selectedArea === "Otra" ? this.selectedAreaOtra : "",
          turno: parseInt(this.selectedTurno),
          responsable: this.responsableRechazo,
          defectoEnLamina: this.selectedDefectoLamina,
          defectoEnLaminaOtros:
            this.selectedDefectoLamina === "Otros"
              ? this.selectedDefectoLaminaOtros
              : "",
          causaLamina:
            this.selectedDefectoLamina !== "Ningún defecto"
              ? this.selectedCausaLamina
              : undefined,
          defectoEnCaja: this.selectedDefectoCaja,
          defectoEnCajaOtros:
            this.selectedDefectoCaja === "Otros"
              ? this.selectedDefectoCajaOtros
              : "",
          causaCaja:
            this.selectedDefectoCaja !== "Ningún defecto"
              ? this.selectedCausaCaja
              : undefined,
          totalKilos: this.totalKilos ? this.totalKilos : undefined,
        };

        let res = await axios.put(
          `http://localhost:3000/api/actualizar/${this.id}`,
          nuevoControl
        );

        if (res.status === 200) {
          // Generar el PDF
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
        this.mensajeError = "Error al enviar el documento 2.";
        this.mostrarError = true;
      } finally {
        this.mostrarConfirmacion = false; // Cerrar la alerta después de enviar
      }
    },
    formatearFecha(fecha) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const fechaFormateada = new Date(fecha).toLocaleDateString(
        "es-ES",
        options
      );
      return fechaFormateada;
    },
    cerrarDialogo() {
      // Manejar el evento para cerrar el diálogo en el componente padre
      this.mostrarError = false;
    },
    async obtenerDoc(id) {
      try {
        let res = await axios.get(`http://localhost:3000/api/obtener/${id}`);
        this.fechaDoc = this.formatearFecha(res.data.fecha);
        this.selectedArea = res.data.area;
        this.nroRevisionActual = res.data.nroRevision;
        if (this.selectedArea === "Otra") {
          this.selectedAreaOtra = res.data.areaOtra;
        }
        this.selectedTurno = res.data.turno.toString();
        this.responsableRechazo = res.data.responsable;
        this.selectedDefectoLamina = res.data.defectoEnLamina;
        if (this.selectedDefectoLamina === "Otros") {
          this.selectedDefectoLaminaOtros = res.data.defectoEnLaminaOtros;
        }
        this.selectedCausaLamina = res.data.causaLamina;
        this.selectedDefectoCaja = res.data.defectoEnCaja;
        if (this.selectedDefectoCaja === "Otros") {
          this.selectedDefectoCajaOtros = res.data.defectoEnCajaOtros;
        }
        this.selectedCausaCaja = res.data.causaCaja;
        this.totalKilos = res.data.totalKilos;
      } catch (error) {
        console.error(
          `Error al obtener el control con ID ${id}:`,
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
    retroceder() {
      this.$router.push("/");
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
  margin-bottom: -10px;
  text-align: center; 
}

.centrar-alerta {
  display: flex;
  align-items: center;
  justify-content: center;
  max-width: 80%; /* Ajusta este valor según tus necesidades */
  margin: 0 auto; /* Para centrar horizontalmente */
}
</style>
