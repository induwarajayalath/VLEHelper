import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

// eslint-disable-next-line no-unused-vars
const theme = {
    primary: '#9C27B0',
    secondary: '#ea80fc',
    accent: '#efefef',
    info: '#FFC107',
  }

export default new Vuetify({
    theme: {
        themes: {
          dark: theme,
          light: theme,
        },
      },
});
