<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-grande">
          <v-card-title class="text-h6 text-md-h5 text-lg-h4 text-center"
            >Control desperdicio:</v-card-title
          >
          <v-card-text class="subtitulos"> N° revisión: {{ documento.nroRevision }}</v-card-text>
          <v-card-text class="subtitulos"> Área: {{ documento.area }}</v-card-text>
          <v-card-text class="subtitulos"> Turno: {{ documento.turno }}</v-card-text>
          <v-card-text class="subtitulos"> Responsable: {{ documento.responsable }}</v-card-text>
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
          <v-row justify="center">
            <v-textarea
              v-model="cantidad"
              label="Cantidad"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row>
            <v-col
              ><v-btn variant="tonal" block class="mt-2" color="green-darken-1"
                >Enviar control</v-btn
              ></v-col
            >
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="red-darken-1"
                @click="$router.push('/escanear')"
                >Retroceder</v-btn
              ></v-col
            >
          </v-row>
        </v-card>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      id: "",
      orden: {},
      documento: {},
      totalKilos: "",
      cantidad: "",
      numeroOrden: "",
    };
  },
  mounted() {
    this.id = this.$route.params.id;
    // Realiza acciones con el ID, por ejemplo, llama a obtenerDoc con el ID
    this.obtenerDoc(this.id);
  },
  methods: {
    async obtenerDoc(id) {
      try {
        let res = await axios.get(`http://localhost:3000/api/obtener/${id}`);
        this.documento = res.data;
      } catch (error) {
        console.error(
          `Error al obtener el control con ID ${id}:`,
          error.message
        );
      }
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
  },
};
</script>

<style scoped>
.card-grande {
  border: none;
  width: 65%;
  padding: 30px;
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
