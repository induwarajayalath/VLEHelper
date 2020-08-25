<template>
  <v-app>
    <v-app-bar app color="#20639b" dark>
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="./assets/logo.jpg"
          transition="scale-transition"
          width="40"
        />
        <h1>VLE Sticky Notes</h1>
      </div>

      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content :style="myStyle">
      <HomePage />
    </v-content>
  </v-app>
</template>

<script>
import HomePage from "./components/HomePage";

export default {
  name: "App",

  components: {
    HomePage,
  },

  data: () => ({
    myStyle: { backgroundColor: "#757575" },
  }),
};
</script>
