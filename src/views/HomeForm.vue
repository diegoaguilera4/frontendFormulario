<template>
  <div class="home">
    <v-btn variant="outlined" @click="redirectToForm">Crear documento</v-btn>
    <TablaForm />

  </div>
</template>

<script>
import TablaForm from "../components/TablaForm.vue";
export default {
  name: "HomeForm",
  components: {
    TablaForm,
  },
  methods: {
    redirectToForm() {
      // Puedes redirigir a la ruta del formulario aquí, por ejemplo:
      this.$router.push("/form");
    },
  },
};
</script>

<style scoped>
.home {
  text-align: center;
  margin-top: 50px;
}

/* Puedes agregar estilos adicionales para el v-button según sea necesario */
</style>
