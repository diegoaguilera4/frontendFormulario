<template>
  <v-sheet width="1000" class="mx-auto mt-11">
    <v-form fast-fail @submit.prevent>
      <v-row justify="start">
        <v-combobox
          v-model="selectedArea"
          label="Area"
          :items="[
            'corrugadora',
            'ward1',
            'ward2',
            'w3',
            'w4',
            'w6',
            'hy-cor',
            'j&l',
            'planificación',
            'perdida arm.',
            'desarrollo',
            'ventas',
            'despacho',
            'cerecinado',
            'maquila',
            'laboratorio',
            'desponche',
            'plástico',
            'Otra',
          ]"
          variant="outlined"
        ></v-combobox>
      </v-row>

      <v-row justify="start" v-if="selectedArea === 'Otra'">
        <v-textarea
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
          :items="[
            'Curvo',
            'Despegado',
            'Desalineado',
            'Medida errada',
            'Largo y corto',
            'Excedentes',
            'Pliegues',
            'Onda saltada',
            'Daño mecanico',
            'Manejo',
            'Otros',
          ]"
          variant="outlined"
        ></v-combobox>
      </v-row>

      <v-row justify="start" v-if="selectedDefectoLamina === 'Otros'">
        <v-textarea
          label="Otros"
          variant="outlined"
          dense
          rows="1"
          max-rows="4"
        ></v-textarea>
      </v-row>

      <v-row justify="start">
        <v-combobox
          v-model="selectedCausaLamina"
          label="Causa de defecto en lamina"
          :items="[
            'Baja Velocidad',
            'Empalmes',
            'Corte de papel',
            'Poca aplicación',
            'Secado de colero',
            'Exceso de temperatura',
            'Falta de temperatura',
            'Raya en mesa',
            'Limitadores',
            'Poco trim',
            'Diferencia de formato',
            'Problema de papel',
            'Cambio de lista',
            'Reprogragmaciones',
            'Operacional',
            'Cuchillos',
            'Falla mecánica',
            'Falla eléctrica',
            'Ensayos',
            'Exceso de Humedad Papel',
          ]"
          variant="outlined"
        ></v-combobox>
      </v-row>

      <v-row justify="start">
        <v-combobox
          v-model="selectedDefectoCaja"
          label="Defecto en caja"
          :items="[
            'Problemas de impresión',
            'Tranconces',
            'Troquel',
            'Set-up',
            'Gap/Descuadre',
            'Rayado partido',
            'Otros',
          ]"
          variant="outlined"
        ></v-combobox>
      </v-row>

      <v-row justify="start" v-if="selectedDefectoCaja === 'Otros'">
        <v-textarea
          label="Otros"
          variant="outlined"
          dense
          rows="1"
          max-rows="4"
        ></v-textarea>
      </v-row>

      <v-row justify="start">
        <v-combobox
          v-model="selectedCausaCaja"
          label="Causa de defecto en caja"
          :items="[
            'Falta de tinta',
            'Cartón húmedo',
            'Cartón absorbente',
            'Falta de presión anillos',
            'Tinta no da tono',
            'Problemas de ????',
            'Falta de presión impresor',
            'Placas dobladas',
            'Deslaminado???',
            'Problema eléctrico',
            'Problema mecánico',
            'Placas agalletadas???',
            'Cartón curvo',
            'Desarrollo de producto',
            'Primeras cajas',
            'Operacional',
            'Problema de matriz',
            'Ensayos',
          ]"
          variant="outlined"
        ></v-combobox>
      </v-row>

      <v-btn type="submit" block class="mt-2">Submit</v-btn>
    </v-form>
  </v-sheet>
</template>

<script>
export default {
  data() {
    return {
      selectedArea: "",
      selectedDefectoLamina: "",
      selectedCausaLamina: "",
      selectedTurno: "",
      selectedDefectoCaja: "",
      selectedCausaCaja: "",
    };
  },
};
</script>

<style></style>
