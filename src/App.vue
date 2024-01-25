<template>
  <v-app>
    <v-app-bar app color="#80439b" dark height="100">
      <v-layout row wrap justify-space-around>

        <!-- <v-flex smAndDown1 md1 lgAndUp1>
          <v-img alt="Application Created by Induwara Jayalath" class="shrink mr-2" contain src="./assets/logo2.png"
            transition="scale-transition" width="40" />
        </v-flex> -->

        <v-flex smAndDown0 md4 lgAndUp2>
          <h1 style=" padding-left: 17px; text-align: left; vertical-align:bottom;">📝 ❤️ Sticky Notes</h1>
        </v-flex>
        <v-spacer></v-spacer>

        <v-flex smAndDown1 md5 lgAndUp6>
          <h2 style="color: #aaa; text-align: center; vertical-align:bottom; height: inherit;" v-if="loginBool">🤘 Hello
            {{
              uname }}</h2>
        </v-flex>
        <v-spacer></v-spacer>

        <v-flex smAndDown2 md3 lgAndUp3>
          <v-btn text outlined large @click="logout()" v-if="loginBool">
            Logout
          </v-btn>
        </v-flex>
      </v-layout>
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
