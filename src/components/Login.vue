<template>
  <div class="login-wrapper">
    <v-overlay v-if="overlay" class="align-center justify-center" z-index="1000">
      <v-progress-circular indeterminate size="64" width="6" color="primary"></v-progress-circular>
    </v-overlay>

    <v-container class="fill-height justify-center px-4" fluid>
      <v-card class="auth-card" elevation="10">
        <div class="auth-header">
          <img src="../assets/icon.png" class="auth-logo" alt="sipwin logo" @click="sendToHome" />
          <h2 class="auth-title">{{ isLogin ? 'Welcome Back' : 'Create Account' }}</h2>
          <p class="auth-subtitle">{{ isLogin ? 'Sign in to continue' : 'Join us to get started' }}</p>
        </div>

        <v-tabs v-model="tab" grow class="auth-tabs" slider-color="primary">
          <v-tab @click="isLogin = true">Sign In</v-tab>
          <v-tab @click="isLogin = false">Sign Up</v-tab>
        </v-tabs>

        <v-card-text class="auth-body">
          <v-alert v-if="showError" type="error" dense dismissible v-model="showError" class="mb-4">
            {{ errormm }}
          </v-alert>
          <v-alert v-if="successBool" type="success" dense dismissible v-model="successBool" class="mb-4">
            {{ successMsg }}
          </v-alert>

          <v-form @submit.prevent="handleSubmit">
            <v-text-field
              v-if="!isLogin"
              v-model="userName"
              label="Full Name"
              prepend-inner-icon="mdi-account-outline"
              outlined
              dense
              class="rounded-lg mb-2"
            ></v-text-field>

            <v-text-field
              v-model="email"
              label="Email Address"
              prepend-inner-icon="mdi-email-outline"
              outlined
              dense
              required
              class="rounded-lg mb-2"
            ></v-text-field>

            <v-text-field
              v-model="password"
              label="Password"
              prepend-inner-icon="mdi-lock-outline"
              outlined
              dense
              required
              :type="pwVisibility ? 'text' : 'password'"
              :append-icon="pwVisibility ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
              @click:append="pwVisibility = !pwVisibility"
              class="rounded-lg mb-4"
            ></v-text-field>

            <v-btn
              block
              large
              color="primary"
              type="submit"
              class="auth-btn rounded-lg mt-2"
              :loading="overlay"
              elevation="0"
            >
              {{ isLogin ? 'Sign In' : 'Sign Up' }}
            </v-btn>

            <div class="divider mt-6 mb-4">
              <span>OR</span>
            </div>

            <v-btn
              block
              outlined
              color="grey darken-1"
              class="google-btn rounded-lg"
              @click="loginWithGoogle"
            >
              <v-icon left>mdi-google</v-icon>
              Continue with Google
            </v-btn>
          </v-form>
        </v-card-text>
      </v-card>
    </v-container>
  </div>
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
    email: "",
    password: "",
    userName: "",
    showError: false,
    errormm: " ",
    successMsg: "",
    successBool: false,
    tab: 0,
    isLogin: true,
    pwVisibility: false,
  }),

  methods: {
    toggleTab() {
      this.isLogin = !this.isLogin;
      this.tab = this.isLogin ? 0 : 1;
    },
    handleSubmit() {
      if (this.isLogin) {
        this.loginWithEmail();
      } else {
        this.signUpWithEmail();
      }
    },
    signUpWithEmail() {
      if (!this.email || !this.password || !this.userName) {
        this.setError("Please fill in all fields");
        return;
      }
      this.overlay = true;
      firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
        .then((userCredential) => {
          const user = userCredential.user;
          user.updateProfile({
            displayName: this.userName,
          }).then(() => {
            this.handleAuthSuccess("Account created successfully!");
          }).catch((error) => {
            this.setError(error.message);
          });
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
    loginWithEmail() {
      this.overlay = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password)
        .then(() => {
          this.handleAuthSuccess("Welcome Back!");
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
    loginWithGoogle() {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider)
        .then(() => {
          this.handleAuthSuccess("Welcome Back!");
        })
        .catch((error) => {
          this.setError(error.message);
        });
    },
    handleAuthSuccess(msg) {
      this.showError = false;
      this.successBool = true;
      this.successMsg = msg;
      
      const user = firebase.auth().currentUser;
      VueCookies.config("1y");
      VueCookies.set("uid", user.uid);
      if (user.displayName) {
        VueCookies.set("uname", user.displayName);
      }
      
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    },
    setError(msg) {
      this.overlay = false;
      this.errormm = msg;
      this.showError = true;
    },
    sendToHome() {
      // Logic if logo is clicked
    },
  },
};
</script>

<style scoped>
.login-wrapper {
  background-color: #f7f8f2;
  min-height: calc(100vh - 100px); /* Adjust for App Bar height */
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-card {
  width: 100%;
  max-width: 450px;
  border-radius: 20px !important;
  border: 1px solid #e2e8f0 !important;
  background: white !important;
}

.auth-header {
  padding: 40px 24px 20px;
  text-align: center;
}

.auth-logo {
  width: 140px;
  height: auto;
  margin-bottom: 20px;
  cursor: pointer;
}

.auth-title {
  font-size: 26px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.auth-subtitle {
  font-size: 15px;
  color: #64748b;
  margin-bottom: 0;
}

.auth-tabs {
  margin-bottom: 8px;
  border-bottom: 1px solid #f1f5f9;
}

.auth-body {
  padding: 24px 32px !important;
}

.auth-btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.3px;
  height: 48px !important;
  background-color: #5680e9 !important; /* Matches App Bar color */
  color: white !important;
}

.google-btn {
  text-transform: none;
  font-weight: 600;
  height: 48px !important;
  border: 1px solid #e2e8f0 !important;
  color: #334155 !important;
}

.divider {
  display: flex;
  align-items: center;
  text-align: center;
  color: #cbd5e1;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 1px;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid #f1f5f9;
}

.divider span {
  padding: 0 12px;
}

/* Vuetify specific overrides */
.rounded-lg >>> .v-input__control > .v-input__slot {
  border-radius: 12px !important;
  background-color: #f8fafc !important;
}

.rounded-lg >>> fieldset {
  border-color: #e2e8f0 !important;
}

.rounded-lg.v-input--is-focused >>> fieldset {
  border-color: #5680e9 !important;
  border-width: 2px;
}
</style>
