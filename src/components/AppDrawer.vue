<template>
  <v-navigation-drawer v-model="drawer" absolute temporary>
    <v-list>
      <v-list-item @click="$router.push('/')">
        <v-list-item-title>Control desperdicio</v-list-item-title>
      </v-list-item>
      <v-list-item @click="$router.push('/escanear')">
        <v-list-item-title>Escanear</v-list-item-title>
      </v-list-item>
      <v-list-item @click="$router.push('/picado')">
        <v-list-item-title>Picado</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
  <v-app-bar>
    <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
  </v-app-bar>
</template>

<script>
export default {
  name: "AppDrawer",
  data() {
    return {
      drawer: false,
    };
  },
};
</script>

<style scoped></style>
