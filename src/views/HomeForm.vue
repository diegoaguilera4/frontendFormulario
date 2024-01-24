<template>
  <v-app>
    <AppDrawer />

    <v-main>
      <TablaForm />
    </v-main>
  </v-app>
</template>

<script>
import TablaForm from "../components/TablaForm.vue";
import AppDrawer from "../components/AppDrawer.vue";

export default {
  name: "HomeForm",
  components: {
    TablaForm,
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
