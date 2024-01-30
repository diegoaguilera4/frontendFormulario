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
            Revisión N°: {{ nroRevisionActual }}
          </v-card-text>
          <v-card-text class="subtitulos">Fecha: {{ fechaDoc }}</v-card-text>
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
      cantidadVersiones: "",
      nroRevisionActual: "",
      fechaDoc: "",
    };
  },
  watch: {
    selectedArea(newSelectedArea) {
      // Actualizar el índice de selectedAreaIndex cuando cambie selectedArea
      this.selectedAreaIndex = this.areas.indexOf(newSelectedArea);
      this.selectedDefecto = "";
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.nroRevision = this.$route.params.nroRevision;
    // Realiza acciones con el ID, por ejemplo, llama a obtenerDoc con el ID
    this.obtenerDoc(this.id, this.nroRevision);
  },
  methods: {
    validarSeleccion(lista, valor) {
      // Validar que el valor esté presente en la lista
      return lista.includes(valor);
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
          nroRevision: this.cantidadVersiones + 1,
          area: this.selectedArea,
          turno: parseInt(this.selectedTurno),
          tipo: this.selectedTipo,
          defecto: this.selectedDefecto,
          responsable: this.responsableRechazo,
          cliente: this.orden.CustomerName,
          producto: this.orden.ProductDescription,
          cantidad: this.orden.QuantityOrdered,
          nroOp: this.numeroOrden,
          estNumber: this.orden.EstNumber,
          fecha: new Date(),
        };

        let res = await axios.put(
          `http://localhost:3000/api/actualizar/${this.id}`,
          nuevoControl
        );
        //

        if (res.status === 200) {
          const doc = nuevoControl;
          doc.fecha = this.formatearFecha(nuevoControl.fecha);
          doc.idAux = res.data.idAux;
          const pdfDefinition = generarPdf(doc);
          // Abre el PDF en una nueva ventana o descárgalo
          pdfMake.createPdf(pdfDefinition).open();
          // Opción para descargar el PDF directamente:
          // pdfMake.createPdf(pdfDefinition).download('nombre_del_archivo.pdf');
          this.$router.push("/");
          this.mensajeError = "Documento creado con éxito.";
          this.mostrarError = true;
        } else {
          this.mensajeError = "Error al generar documento pdf.";
          this.mostrarError = true;
        }
      } catch (error) {
        this.mensajeError = error;
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
    async obtenerDoc(id, nroRevision) {
      try {
        let res = await axios.get(
          `http://localhost:3000/api/obtenerVersion/${id}/${nroRevision}`
        );
        this.fechaDoc = this.formatearFecha(res.data.version.fecha);
        this.selectedTurno = res.data.version.turno.toString();
        this.selectedTipo = res.data.version.tipo;
        this.selectedArea = res.data.version.area;
        this.selectedDefecto = res.data.version.defecto;
        this.responsableRechazo = res.data.version.responsable;
        this.nroRevisionActual = res.data.version.nroRevision;
        this.cliente = res.data.version.cliente;
        this.producto = res.data.version.producto;
        this.cantidad = res.data.version.cantidad;
        this.numeroOrden = res.data.version.nroOp;
        this.estNumber = res.data.version.estNumber;
        this.cantidadVersiones = res.data.cantidadVersiones;
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
