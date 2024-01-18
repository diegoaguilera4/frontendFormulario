<template>
  <div class="d-flex justify-center align-center" style="height: 100vh">
    <v-card>
      <v-card-title>Escanea un código de barras</v-card-title>
      <v-card-text>
        <v-row align="center" justify="center">
          <v-text-field
            v-model="barcode"
            label="Código de barras"
          ></v-text-field>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" @click="scanBarcode">Escanear</v-btn>
      </v-card-actions>
      <div v-if="Object.keys(documento).length > 0">
        <div class="text-body-1">Área: {{ documento.area }}</div>
        <div class="text-body-1">Turno: {{ documento.turno }}</div>
        <div class="text-body-1">Responsable: {{ documento.responsable }}</div>
      </div>
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

<style scoped>
/* Estilos específicos para esta vista */
</style>
