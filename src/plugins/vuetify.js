// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

const myCustomTheme = {
  dark: false,
  colors: {
    primary: "#80162B",
    cream: "#DADADA",
    secondary: "262626",
  },
};

// Vuetify
import { createVuetify } from "vuetify";

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  theme: {
    defaultTheme: "myCustomTheme",
    themes: {
      myCustomTheme,
    },
  },
});
