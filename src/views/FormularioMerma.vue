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
              v-model="nombre"
              label="Nombre"
              variant="outlined"
              dense
              rows="1"
              max-rows="4"
            ></v-textarea>
          </v-row>
          <v-row justify="center">
            <v-textarea
              v-model="rut"
              label="RUT"
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
                >Guardar</v-btn
              ></v-col
            >
            <v-col
              ><v-btn
                variant="tonal"
                block
                class="mt-2"
                color="red-darken-1"
                @click="$router.push('/escanear')"
                append-icon="mdi-arrow-left-bold-circle-outline"
                >Cancelar</v-btn
              ></v-col
            >
          </v-row>
        </v-card>
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      id: "",
      idAux: "",
      orden: {},
      documento: {},
      numeroOrden: "",
      nombre: "",
      rut: "",
      selectedTurno: "",
      totalKilos: "",
      patente: "",
      empresa: "",
      selectedTipo: "",
      otroTipo: "",
    };
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
