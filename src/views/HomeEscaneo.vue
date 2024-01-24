<template>
  <v-app>
    <AppDrawer />
    <v-main>
      <EscanearBarra />
    </v-main>
  </v-app>
</template>

<script>
import EscanearBarra from "../components/EscanearBarra.vue";
import AppDrawer from "../components/AppDrawer.vue";

export default {
  name: "HomeEscaneo",
  components: {
    EscanearBarra,
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
