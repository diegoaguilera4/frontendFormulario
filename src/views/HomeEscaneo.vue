<template>
  <div class="home">
    <v-app>
        <v-navigation-drawer v-model="drawer" absolute temporary>
        <v-list>
          <v-list-item @click="$router.push('/')">
            <v-list-item-title>Documentos</v-list-item-title>
          </v-list-item>
          <v-list-item @click="$router.push('/escanear')">
            <v-list-item-title>Escanear</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <v-app-bar>
        <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      </v-app-bar>

      <v-main>
        <EscanearBarra/>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import EscanearBarra from "../components/EscanearBarra.vue";

export default {
  name: "HomeEscaneo",
  components: {
    EscanearBarra,
  },
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped>
.home {
  text-align: center;
}
</style>
