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
        <h1>Sticky Notes</h1>

        <v-spacer></v-spacer>
        <v-btn text outlined large @click="logout()">
          Logout
        </v-btn>
      </div>
    </v-app-bar>

    <v-content :style="myStyle" v-show="!loginBool">
      <Login />
    </v-content>
    <v-content :style="myStyle" v-show="loginBool">
      <HomePage />
    </v-content>
  </v-app>
</template>

<script>
import Vue from "vue";
import HomePage from "./components/HomePage";
import Login from "./components/Login";
import VueCookies from "vue-cookies";
import firebase from "firebase";
Vue.use(VueCookies);

export default {
  name: "App",

  components: {
    HomePage,
    Login,
  },

  data: () => ({
    myStyle: { backgroundColor: "#757575" },
    loginBool: false,
  }),

  mounted() {
    if (VueCookies.isKey("uid")) {
      this.loginBool = true;
    }
  },

  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          VueCookies.remove("uid");
          this.loginBool = false;
          console.log("done");
        });
    },
  },
};
</script>
