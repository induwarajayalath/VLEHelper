<template>
  <v-app>
    <v-content>
      <v-overlay v-if="overlay" class="align-center justify-center">
        <v-progress-circular indeterminate :size="59" :width="12"></v-progress-circular>
      </v-overlay>
      <v-container fluid >
        <v-layout  justify-center>
          <v-card outlined elevation="1" width="700" class="mx-auto">
            <v-flex class="justify-center text-center">
              <div>
                <v-alert class="mx-2 mt-2" type="error" dismissible v-model="showError">{{ this.errormm }}</v-alert>
                <v-alert class="mx-2 mt-2" type="success" dismissible v-model="successBool"
                  transition="scale-transition">{{ this.successMsg }}</v-alert>
              </div>
              <v-row class="px-2 pt-3" align="center" justify="center">
                <v-col sm="6" cols="12">
                  <div class="layout column align-center">
                    <img class="pl-3" src="../assets/logo3.png" width="300" height="250" alt="sipwin logo"
                      @click="sendToHome()" />
                  </div>
                </v-col>
                <v-col v-if="newUser">
                  <v-text-field v-model="userName" label="Your Name" outlined dense clearable
                    class="mt-5"></v-text-field>
                  <v-text-field v-model="loginId" label="User Name" outlined dense clearable></v-text-field>

                  <v-text-field v-model="loginPw" label="Password" outlined dense clearable
                    :type="pwVisibility ? 'text' : 'password'"
                    :append-outer-icon="pwVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-outer="pwVisibility = !pwVisibility"></v-text-field>

                  <v-text-field v-model="loginPwRepeat" label="Repeat Password" outlined dense clearable
                    :type="pwVisibility ? 'text' : 'password'"
                    :append-outer-icon="pwVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-outer="pwVisibility = !pwVisibility" class="mb-3"></v-text-field>

                  <v-btn class="mb-5" block style="background-color:#3fc96b; color: white;" @click='signUpUsingId'>Sign
                    me
                    Up</v-btn>
                </v-col>
                <v-col v-if="ifId && !newUser">
                  <v-text-field v-model="loginId" label="User ID" outlined dense clearable></v-text-field>

                  <v-text-field v-model="loginPw" label="Password" outlined dense clearable
                    :type="pwVisibility ? 'text' : 'password'"
                    :append-outer-icon="pwVisibility ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-outer="pwVisibility = !pwVisibility" @keyup.enter="loginUsingId"
                    class="mb-3"></v-text-field>

                  <v-row class="mt-3 mb-5" justify="center" align="center" dense>
                    <v-col cols="5">
                      <v-btn block style="background-color:#3fc96b; color: white;" @click="newUser = true">New
                        User + </v-btn>
                    </v-col>
                    <v-col cols="5">
                      <v-btn block style="background-color:#ce3741; color: white;" @click="loginUsingId">Login
                        -></v-btn>
                    </v-col>

                  </v-row>
                </v-col>

                <v-col v-if="!ifId && !newUser" sm="6" cols="12">
                  <h1 class="flex mb-1" style="color:#253a7c;">ආයුබෝවන්</h1>
                  <v-card-text>
                    <v-form>
                      <v-btn class="mb-4" block style="background-color:#ce3741; color: white;"
                        v-on:click='ifId = true'>Login using
                        UserName</v-btn>
                      <v-btn class="mb-3" block style="background-color:#bb873e; color: white;" @click="login">Login
                        using
                        Google</v-btn>

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
                    <v-progress-circular indeterminate :size="59" :width="12"></v-progress-circular>
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
    overlay: false,
    found: false,
    loading: false,
    email: "",
    password: "",
    showError: false,
    errormm: " ",
    successMsg: "",
    successBool: false,
    dialogFullScreenLoader: false,
    ifId: false,
    loginId: "",
    loginPw: "",
    loginPwRepeat: "",
    newUser: false,
    pwVisibility: false,
    userName: "",
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
    signUpUsingId: function (e) {
      if (this.loginPw != this.loginPwRepeat) {
        this.errormm = "Password Missmatch !!!";
        this.showError = true;
        return;
      }
      this.overlay = true;
      let userEmail = this.loginId + "@appendemail.com";
      firebase.auth().createUserWithEmailAndPassword(userEmail, this.loginPw)
        .then((userCredential) => {
          var user = userCredential.user;
          user.updateProfile({
            displayName: this.userName,
          }).then(() => {
            // Signed in 
            console.log(user);
            VueCookies.config("1y");
            this.showError = false;
            this.successBool = true;
            this.successMsg = "Welcome Back !";
            let uid = firebase.auth().currentUser.uid;
            VueCookies.set("uid", uid);
            let name = firebase.auth().currentUser.displayName;
            VueCookies.set("uname", name);
            window.location.reload();
          }).catch((error) => {
            this.errormm = error.message;
            this.showError = true;
          });
        })
        .catch((error) => {
          this.overlay = false;
          this.errormm = error.message;
          this.showError = true;
        });
      e.preventDefault();
    },
    loginUsingId: function (e) {
      this.overlay = true;
      let userEmail = this.loginId + "@appendemail.com";
      firebase.auth().signInWithEmailAndPassword(userEmail, this.loginPw)
        .then((userCredential) => {
          // Signed in 
          var user = userCredential.user;
          console.log(user);
          VueCookies.config("1y");
          this.showError = false;
          this.successBool = true;
          this.successMsg = "Welcome Back !";
          let uid = firebase.auth().currentUser.uid;
          VueCookies.set("uid", uid);
          let name = firebase.auth().currentUser.displayName;
          VueCookies.set("uname", name);
          window.location.reload();
        })
        .catch((error) => {
          this.overlay = false;
          console.log(error.code);
          if (error.code == "auth/user-not-found") {
            this.loginPw = '';
            this.newUser = true;
          }
          this.errormm = error.message;
          this.showError = true;
        });

      e.preventDefault();
    },
    login: function (e) {
      let provider = new firebase.auth.GoogleAuthProvider();
      firebase
        .auth()
        .signInWithPopup(provider)
        .then(
          (user) => {
            this.overlay = true;
            console.log(user);
            VueCookies.config("1y");
            this.showError = false;
            this.successBool = true;
            this.successMsg = "Welcome Back !";
            let uid = firebase.auth().currentUser.uid;
            VueCookies.set("uid", uid);
            let name = firebase.auth().currentUser.displayName;
            VueCookies.set("uname", name);
            window.location.reload();
          },
          (err) => {
            // alert(err.message);
            this.errormm = err.message;
            this.showError = true;
            this.overlay = false;
          }
        );
      e.preventDefault();
    },
    sendToHome() {
      this.ifId = false;
      this.newUser = false;
      //this.$router.push("/");
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
