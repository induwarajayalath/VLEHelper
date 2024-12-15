<template>
  <v-app>
    <v-app-bar app color="#5680e9" dark height="100">
      <v-row justify="space-between" align="center">

        <!-- Title Section -->
        <v-col cols="6" sm="4" md="2">
          <h1 class="app-title">📝 Note Pal</h1>
        </v-col>

        <!-- Welcome Message -->
        <v-col cols="6" sm="12" md="5" class="text-center">
          <h2 v-if="loginBool" class="welcome-message">🙏 ආයුබෝවන් {{ uname }}</h2>
        </v-col>

        <!-- Logout Button -->
        <v-col cols="12" sm="12" md="3" class="text-right">
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
    myStyle: {
      backgroundColor: "#757575",
      margin: '0',
    },
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
  font-size: 2.5em;
  word-wrap: break-word;
}

.welcome-message {
  font-size: 1.8em;
  word-wrap: break-word;
}

@media (max-width: 600px) {
  .app-title {
    font-size: 1.2em;
  }

  .welcome-message {
    font-size: 1em;
  }
}
</style>
