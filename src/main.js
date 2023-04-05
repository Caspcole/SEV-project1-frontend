import { createApp } from "vue";
import App from "./App.vue";
import vuetify from "./plugins/vuetify.js";
import { loadFonts } from "./plugins/webfontloader.js";
import router from "./router/index.js";
import VueDatePicker from "@vuepic/vue-datepicker";
import "@vuepic/vue-datepicker/dist/main.css";

loadFonts();

createApp(App)
  .use(vuetify)
  .use(router)
  .component("VueDatePicker", VueDatePicker)
  .mount("#app");
