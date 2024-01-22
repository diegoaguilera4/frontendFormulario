<template>
  <div class="d-flex justify-center align-center" style="height: 100vh">
    <v-card class="card-sombra">
      <v-card-title style="margin-bottom:20px">Escanea un código de barras</v-card-title>
      <v-card-text>
        <v-row align="center" justify="center">
          <v-text-field
            v-model="barcode"
            label="Código de barras"
          ></v-text-field>
        </v-row>
        <v-row>
        </v-row>
      </v-card-text>
      <v-card-actions class="justify-center">
        <v-btn color="primary" variant="tonal" @click="scanBarcode">Escanear</v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      barcode: "",
      documento: {},
    };
  },
  methods: {
    async scanBarcode() {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/obtener/${this.barcode}`
        );
        this.documento = response.data;
        this.irFormPeso(this.documento._id);
        // Ahora tienes el documento y puedes hacer lo que necesites con él
      } catch (error) {
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
.card-sombra{
  width: 30%;
  padding: 30px;
  border-radius: 20px;
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.35);
}
</style>
