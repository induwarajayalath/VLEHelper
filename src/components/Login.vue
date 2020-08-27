<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-card outlined elevation="1" width="700" class="mx-auto">
            <v-flex class="justify-center text-center">
              <div>
                <v-alert
                  class="mx-2 mt-2"
                  type="error"
                  dismissible
                  v-model="showError"
                  >{{ this.errormm }}</v-alert
                >
                <v-alert
                  class="mx-2 mt-2"
                  type="success"
                  dismissible
                  v-model="successBool"
                  transition="scale-transition"
                  >{{ this.successMsg }}</v-alert
                >
              </div>
              <v-row class="px-2 pt-3" align="center" justify="center">
                <v-col sm="6" cols="12">
                  <div class="layout column align-center">
                    <img
                      class="pl-3"
                      src="../assets/logo.jpg"
                      width="200"
                      height="150"
                      alt="sipwin logo"
                      @click="sendToHome()"
                    />
                  </div>
                </v-col>
                <v-col sm="6" cols="12">
                  <h3 class="flex mb-1" style="color:#253a7c;">Login</h3>
                  <v-card-text>
                    <v-form>
                      <v-btn
                        class="mb-1"
                        block
                        style="background-color:#253a7c; color: white;"
                        @click="login"
                        >Login using Google</v-btn
                      >
                    </v-form>
                  </v-card-text>
                </v-col>
              </v-row>
            </v-flex>
          </v-card>
        </v-layout>
        <v-row>
          <v-dialog v-model="dialogFullScreenLoader" persistent width="200">
            <v-card>
              <v-card-text>
                <v-container>
                  <v-row class="justify-center">Logging in...</v-row>
                  <v-row class="mt-2 justify-center">
                    <v-progress-circular
                      :size="50"
                      color="primary"
                      indeterminate
                    ></v-progress-circular>
                  </v-row>
                </v-container>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-row>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
import firebase from "firebase";
import Vue from "vue";
import VueCookies from "vue-cookies";
import VueSimpleAlert from "vue-simple-alert";
Vue.use(VueSimpleAlert);
Vue.use(VueCookies);
export default {
  data: () => ({
    found: false,
    loading: false,
    email: "",
    password: "",
    showError: false,
    errormm: " ",
    successMsg: "",
    successBool: false,
    dialogFullScreenLoader: false,
    defaultPicUrl:
      "https://firebasestorage.googleapis.com/v0/b/sipwin-online.appspot.com/o/avatar.png?alt=media&token=ea20826f-214a-46ab-aaed-16d0c510be9c",
  }),
  watch: {
    loader() {
      const l = this.loader;
      this[l] = !this[l];
      setTimeout(() => {
        this[l] = false;
      }, 3000);
      this.loader = null;
    },
  },

  methods: {
    login: function(e) {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(
          (user) => {
            console.log(user);
            VueCookies.config("1y");
            this.showError = false;
            this.successBool = true;
            this.successMsg = "You are logged in";
            let uid = firebase.auth().currentUser.uid;
            VueCookies.set("uid", uid);
            window.location.reload();
          },
          (err) => {
            // alert(err.message);
            this.errormm = err.message;
            this.showError = true;
          }
        );
      e.preventDefault();
    },
    sendToHome() {
      this.$router.push("/");
    },
  },
};
</script>
<style scoped lang="css">
#login {
  height: 50%;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  content: "";
  z-index: 0;
}
.centered-input input {
  text-align: center;
}
</style>
