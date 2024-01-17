<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="center">
        <v-card class="card-no-border">
          <v-card-title class="text-h6 text-md-h5 text-lg-h4"
            >Control de desperdicio</v-card-title
          >
          <v-card-text class="subtitulos">
            Hoja de control de pérdida
          </v-card-text>
          <v-card-text class="subtitulos"> Revisión N°: XX </v-card-text>
          <v-card-text class="subtitulos">Fecha: </v-card-text>
        </v-card>
      </v-row>
      <v-row justify="start" style="margin-top: 25px">
        <v-combobox
          v-model="selectedItem"
          label="nuevo item"
          :items="items"
          variant="outlined"
        ></v-combobox>
      </v-row>
      <v-row justify="start">
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
            >Enviar control</v-btn
          ></v-col
        >
        <v-col
          ><v-btn
            variant="tonal"
            block
            class="mt-2"
            color="red-darken-1"
            >Retroceder</v-btn
          ></v-col
        >
      </v-row>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
    data(){
        return{
            selectedItem: "",
            totalKilos: "",
            items: ["Item 1", "Item 2", "Item 3"],
        }
    }
};
</script>

<style scoped>
.card-no-border {
  border: none;
  box-shadow: none;
}

.subtitulos {
  margin-bottom: -13px;
  text-align: center;
}
</style>