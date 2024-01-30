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
            Formulario merma
          </v-card-title>

          <v-row justify="center" style="margin-top: 40px">
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
          <v-row justify="start">
            <v-select
              v-model="selectedTipo"
              label="Tipo"
              :items="['Cajas', 'Láminas', 'Otros']"
            ></v-select>
          </v-row>
          <v-row justify="start">
            <v-textarea
              v-if="selectedTipo === 'Otros'"
              v-model="otroTipo"
              label="Otro tipo"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="start">
            <v-textarea
              v-model="patente"
              label="Patente camión"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="start">
            <v-textarea
              v-model="empresa"
              label="Empresa que envía"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
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
                @click="actualizarMerma()"
                >Guardar</v-btn
              ></v-col
            >
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="red-darken-1"
                @click="$router.push('/formMerma')"
                append-icon="mdi-arrow-left-bold-circle-outline"
                >Cancelar</v-btn
              ></v-col
            >
          </v-row>
        </v-card>
      </v-row>
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
import ErrorDialog from "../components/ErrorDialog.vue";
export default {
  components: {
    ErrorDialog,
  },
  data() {
    return {
      id: "",
      idAux: "",
      orden: {},
      documento: {},
      numeroOrden: "",
      persona: "",
      selectedTurno: "",
      totalKilos: "",
      patente: "",
      empresa: "",
      selectedTipo: "",
      otroTipo: "",
      mostrarError: false,
      mensajeError: "",
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    this.obtenerMerma();
  },
  methods: {
    formatearFecha(fecha) {
      const options = { day: "2-digit", month: "2-digit", year: "numeric" };
      const fechaFormateada = new Date(fecha).toLocaleDateString(
        "es-ES",
        options
      );
      return fechaFormateada;
    },
    async obtenerMerma() {
      //Obtener merma por id
      try {
        const response = await axios.get(
          `http://localhost:3000/merma/obtener/${this.id}`
        );
        if (response.status === 200) {
          this.persona = response.data.persona;
          this.selectedTurno = response.data.turno;
          this.selectedTipo = response.data.tipo;
          this.patente = response.data.patenteCamion;
          this.empresa = response.data.empresaEnvia;
          this.totalKilos = response.data.kilos;
        } else {
          this.mensajeError = "No se encontró la merma";
          this.mostrarError = true;
          return;
        }
      } catch (error) {
        this.mensajeError = "Error para encontrar la merma";
        this.mostrarError = true;
        return;
      }
    },
    async actualizarMerma() {
      try {
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
        if (this.selectedTipo.length === 0) {
          this.mensajeError = "Debe ingresar un tipo";
          this.mostrarError = true;
          return;
        }
        if (this.patente.length === 0) {
          this.mensajeError = "Debe ingresar una patente";
          this.mostrarError = true;
          return;
        }
        if (this.empresa.length === 0) {
          this.mensajeError = "Debe ingresar una empresa";
          this.mostrarError = true;
          return;
        }
        //validar que kilos sea un numero y no string
        if (this.totalKilos.length === 0 || isNaN(this.totalKilos)) {
          this.mensajeError = "Debe ingresar un número válido en totalKilos";
          this.mostrarError = true;
          return;
        }
        if (this.selectedTipo === "Otros") {
          this.selectedTipo = this.otroTipo;
        }
        const nuevaMerma = {
          persona: this.persona,
          turno: this.selectedTurno,
          tipo: this.selectedTipo,
          patenteCamion: this.patente,
          empresaEnvia: this.empresa,
          kilos: this.totalKilos,
        };
        const response = await axios.put(
          `http://localhost:3000/merma/actualizar/${this.id}`,
          nuevaMerma
        );
        if (response.status === 200) {
          this.$router.push("/formMerma");
        } else {
          this.mensajeError = "No se pudo actualizar la merma";
          this.mostrarError = true;
          return;
        }
      } catch (error) {
        this.mensajeError = "Error para actualizar la merma";
        this.mostrarError = true;
        return;
      }
    },
    cerrarDialogo() {
      this.mostrarError = false;
    },
  },
};
</script>

<style scoped>
.card-grande {
  width: 65%;
  padding: 50px;
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
