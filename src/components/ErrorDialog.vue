<!-- ErrorDialog.vue -->
<template>
  <v-dialog v-model="dialogVisible" width="500">
    <v-row justify="center">
      <v-card
        title="Hay un error existente"
        style="border-radius: 20px; padding: 10px"
        class="text-center"
      >
        <v-card-text>{{ mensajeError }}</v-card-text>
        <v-card-actions class="justify-center">
          <v-btn
            text="Cerrar"
            color="red-darken-1"
            variant="tonal"
            @click="cerrarDialog"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </v-row>
  </v-dialog>
</template>

<script>
export default {
  props: {
    mostrarError: Boolean,
    mensajeError: String,
  },
  data() {
    return {
      dialogVisible: false,
    };
  },
  watch: {
    mostrarError(newMostrarError) {
      this.dialogVisible = newMostrarError;
    },
  },
  methods: {
    cerrarDialog() {
      this.$emit("cerrar-dialogo");
    },
  },
};
</script>
