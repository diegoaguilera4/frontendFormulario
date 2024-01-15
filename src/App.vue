<template>
  <v-app>
    <v-main>
      <v-container>
        <FormularioControl />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import FormularioControl from "./components/FormularioControl.vue";
export default {
  name: "App",

  components: {
    FormularioControl,
  },

  data: () => ({
    //
  }),
};
</script>
