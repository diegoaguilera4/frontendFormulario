<template>
  <v-app>
    <AppDrawer />

    <v-main>
      <TablaMerma />
    </v-main>
  </v-app>
</template>

<script>
import TablaMerma from "../components/TablaMerma.vue";
import AppDrawer from "../components/AppDrawer.vue";

export default {
  name: "HomeForm",
  components: {
    TablaMerma,
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
