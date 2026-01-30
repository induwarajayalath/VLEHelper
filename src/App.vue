<template>
  <v-app>
    <v-app-bar app color="white" light elevation="1" height="80" class="px-4">
      <v-container class="fill-height pa-0" fluid>
        <v-row align="center" no-gutters>
          <!-- Logo & Title Section -->
          <v-col cols="auto" class="d-flex align-center">
            <v-avatar size="48" class="mr-3">
              <v-img src="./assets/icon.png" alt="Note Pal Icon"></v-img>
            </v-avatar>
            <div class="d-flex flex-column">
              <h1 class="nav-title">Note Pal</h1>
              <span class="nav-subtitle primary--text">Smart note taking</span>
            </div>
          </v-col>

          <v-spacer></v-spacer>

          <!-- Welcome Message -->
          <v-col cols="auto" class="hidden-xs-only mr-6">
            <div v-if="loginBool" class="welcome-text">
              <span class="greeting">Hello,</span>
              <span class="user-name">{{ uname }}</span>
            </div>
          </v-col>

          <!-- Logout Button -->
          <v-col cols="auto">
            <v-btn
              v-if="loginBool"
              depressed
              class="logout-btn rounded-lg"
              @click="logout"
            >
              <v-icon left size="18">mdi-logout-variant</v-icon>
              Logout
            </v-btn>
          </v-col>
          </v-row>
      </v-container>
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
      backgroundColor: "#f7f8f2",
      margin: '0',
    },
    loginBool: false,
    uname: "",
  }),

  mounted() {
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
.nav-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0f172a;
  line-height: 1.2;
}

.nav-subtitle {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.welcome-text {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.greeting {
  font-size: 0.8rem;
  color: #94a3b8;
  font-weight: 500;
}

.user-name {
  font-size: 1rem;
  font-weight: 700;
  color: #1e293b;
}

.logout-btn {
  background-color: #f1f5f9 !important;
  color: #475569 !important;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  border: 1px solid #e2e8f0 !important;
}

.logout-btn:hover {
  background-color: #e2e8f0 !important;
  color: #0f172a !important;
}

@media (max-width: 600px) {
  .nav-title {
    font-size: 1.2rem;
  }
  .nav-subtitle {
    display: none;
  }
}
</style>
