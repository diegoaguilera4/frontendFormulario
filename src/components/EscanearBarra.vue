<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-sombra">
          <v-card-title style="margin-bottom: 20px"
            >Escanea un código de barras</v-card-title
          >
          <v-card-text>
            <v-row align="center" justify="center">
              <v-text-field
                v-model="barcode"
                label="Código de barras"
                style="width: 50px"
              ></v-text-field>
            </v-row>
            <v-row> </v-row>
          </v-card-text>
          <v-card-actions class="justify-center">
            <v-btn
              color="primary"
              variant="tonal"
              @click="scanBarcode"
              append-icon="mdi-barcode-scan"
              >Escanear</v-btn
            >
          </v-card-actions>
        </v-card>
        <error-dialog
          :mostrarError="mostrarError"
          :mensajeError="mensajeError"
          @cerrar-dialogo="cerrarDialogo"
        />
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";
import ErrorDialog from "./ErrorDialog.vue";
export default {
  components: {
    ErrorDialog,
  },
  data() {
    return {
      barcode: "",
      mostrarError: false,
      mensajeError: "",
    };
  },
  methods: {
    async scanBarcode() {
      try {
        if (this.barcode.length === 0) {
          this.mensajeError = "Debe ingresar un código de barras";
          this.mostrarError = true;
          return;
        } else {
          try {
            const response = await axios.get(
              `http://localhost:3000/api/obtenerPorIdAux/${this.barcode}`
            );
            if (response.status === 200) {
              this.irFormPeso(response.data.idAux);

              return;
            } else {
              this.mensajeError = "No se encontró el documento";
              this.mostrarError = true;
              return;
            }
          } catch (error) {
            this.mensajeError = "Error para encontrar el documento";
            this.mostrarError = true;
            return;
          }
        }
      } catch (error) {
        this.mensajeError = "No se encontró el documento";
        this.mostrarError = true;
        console.error("Hubo un error al obtener el documento:", error);
      }
    },
    irFormPeso(id) {
      //ir a formularioescaneo con el id
      this.$router.push(`/formEscaneo/${id}`);
    },
    cerrarDialogo() {
      // Manejar el evento para cerrar el diálogo en el componente padre
      this.mostrarError = false;
    },
  },
};
</script>

<style>
.card-sombra {
  width: 40%;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.35);
}
</style>
