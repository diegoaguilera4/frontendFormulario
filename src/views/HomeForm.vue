<template>
  <div class="home">
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
