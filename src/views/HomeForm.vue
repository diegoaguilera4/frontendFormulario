<template>
  <div class="home">
    <v-app>
      <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list>
          <v-list-item @click="currentComponent = 'TablaForm'">
            <v-list-item-title>Documentos</v-list-item-title>
          </v-list-item>
          <v-list-item @click="currentComponent = 'EscanearBarra'">
            <v-list-item-title>Escanear</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>Control de desperdicio</v-toolbar-title>
      </v-app-bar>

      <v-main>
        <component :is="currentComponent" />
      </v-main>
    </v-app>
  </div>
</template>

<script>
import TablaForm from "../components/TablaForm.vue";
import EscanearBarra from "../components/EscanearBarra.vue";

export default {
  name: "HomeForm",
  components: {
    TablaForm,
    EscanearBarra
  },
  data() {
    return {
      drawer: false,
      currentComponent: 'TablaForm'
    };
  }
};
</script>

<style scoped>
.home {
  text-align: center;
}
</style>