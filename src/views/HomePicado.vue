<template>
  <v-app>
    <AppDrawer />

    <v-main>
      <TablaPicado />
    </v-main>
  </v-app>
</template>

<script>
import TablaPicado from "../components/TablaPicado.vue";
import AppDrawer from "../components/AppDrawer.vue";

export default {
  name: "HomeForm",
  components: {
    TablaPicado,
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
