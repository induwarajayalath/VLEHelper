<template>
  <v-app>
    <v-app-bar app color="#5680e9" dark height="100">
      <v-row align="center" justify="space-between">

        <!-- Logo Section (Uncomment if needed) -->
        <!--
      <v-col cols="1">
        <v-img 
          alt="Application Created by Induwara Jayalath" 
          src="./assets/logo2.png" 
          class="shrink mr-2" 
          contain 
          transition="scale-transition" 
          width="40"
        />
      </v-col>
      -->

        <!-- Title Section -->
        <v-col cols="4" md="4" lg="2">
          <h1 class="app-title">📝 Sticky Notes</h1>
        </v-col>

        <!-- Welcome Message -->
        <v-col cols="6" md="5" lg="6" class="text-center">
          <h2 v-if="loginBool" class="welcome-message">🙏 ආයුබෝවන්  {{ uname }}</h2>
        </v-col>

        <!-- Logout Button -->
        <v-col cols="2" md="3" lg="3" class="text-right">
          <v-btn text outlined large @click="logout" v-if="loginBool">
            Logout
          </v-btn>
        </v-col>
      </v-row>
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
    console.log(this.$vuetify.breakpoint.name);
    if (VueCookies.isKey("uid")) {
      this.loginBool = true;
      this.uname = VueCookies.get("uname");
    }
  },

  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          VueCookies.remove("uid");
          VueCookies.remove("uname");
          this.loginBool = false;
        });
    },
  },
};
</script>

<style scoped>
.app-title {
  padding-left: 17px;
  text-align: left;
}

.welcome-message {
  color: #ffffff;
}
</style>
