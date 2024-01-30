<template>
  <v-app>
    <AppDrawer />

    <v-main>
      <FormularioMerma />
    </v-main>
  </v-app>
</template>

<script>
import FormularioMerma from "../views/FormularioMerma.vue";
import AppDrawer from "../components/AppDrawer.vue";

export default {
  name: "HomeForm",
  components: {
    FormularioMerma,
    AppDrawer,
  },
  data() {
    return {};
  },
};
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
