import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

// eslint-disable-next-line no-unused-vars
const theme = {
  primary: '#606c38',
  secondary: '#283618',
  accent: '#ccd5ae',
  success: '#3fc96b',
  error: '#ef4444',
}

export default new Vuetify({
  theme: {
    themes: {
      dark: theme,
      light: theme,
    },
  },
});
