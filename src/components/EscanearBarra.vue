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
      <v-dialog v-model="mostrarError" width="500">
        <template v-slot:default="{ isActive }">
          <v-card
            title="Hay un error existente:"
            style="border-radius: 20px; padding: 10px"
          >
            <v-card-text>
              {{ mensajeError }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text="Cerrar"
                color="red-darken-1"
                variant="text"
                @click="isActive.value = false"
              ></v-btn>
            </v-card-actions>
          </v-card>
        </template>
      </v-dialog>
      </v-row>
      
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      barcode: "",
      documento: {},
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
          const response = await axios.get(
            `http://localhost:3000/api/obtener/${this.barcode}`
          );
          if (response.status === 200) {
            this.documento = response.data;
            this.irFormPeso(this.documento._id);

            return;
          } else {
            this.mensajeError = "No se encontró el documento";
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
