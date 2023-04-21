<template>
  <v-container fluid class="fill-height bg-primary">
    <v-row class="fill-height pa-0 ma-0" justify="center">
      <v-col class="pa-0 ma-0">
        <v-expansion-panels variant="accordion" multiple v-model="isExpanded">
          <v-expansion-panel
            bg-color="primary"
            prominent
            class="elevation-0 pa-0 ma-0"
            v-for="(menu, index) in roleMenus"
            :key="index"
            :value="index"
            :title="menu.title"
          >
            <v-expansion-panel-text class="pa-0 ma-0">
              <v-container class="pa-0 ma-0">
                <v-row
                  v-for="(link, index) in menu.links"
                  :key="index"
                  :value="index"
                  class="pa-0 ma-0"
                >
                  <v-col class="pa-0 ma-0">
                    <v-btn
                      block
                      color="primary"
                      prominent
                      class="elevation-0"
                      @click="changeComp(link.route)"
                    >
                      {{ link.link }}
                    </v-btn>
                  </v-col>
                </v-row>
              </v-container>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { defineComponent } from "vue";
import Utils from "../config/utils.js";
import UserDataService from "../services/UserDataService";
export default defineComponent({
  name: "MainNav",
  props: {},
  components: {},
  data() {
    return {
      drawer: false,
      selectedItem: "",
      user: {},
      userWithRoles: {},
      userRoles: [],
      isExpanded: [],
      roleMenus: [],
      userWithRoles: {},
      menus: [
        {
          title: "Student",
          links: [
            { link: "View Repertoire", route: "studentRepertoire" },
            { link: "Upcoming Events", route: "studentViewEvents" },
            { link: "Event Sign-Ups", route: "studentEventSignUps" },
            { link: "View Your Critiques", route: "studentCritiques" },
            { link: "Event Recordings", route: "studentRecordings" },
          ],
          id: 0,
        },
        {
          title: "Faculty",
          links: [
            { link: "View Student Critiques", route: "facultyViewCritiques" },
            { link: "Create Event Critique", route: "facultyCreateCritiques" },
            { link: "Event Availability", route: "createAvailability" },
            { link: "View Repertoires", route: "facultyViewRepertoire" },
          ],
          id: 1,
        },
        {
          title: "Accompanist",
          links: [{ link: "Event Availability", route: "createAvailability" }],
          id: 2,
        },
        {
          title: "Admin",
          links: [{ link: "Events", route: "adminEventsCRUD" }],
          id: 3,
        },
      ],
    };
  },
  methods: {
    changeComp(route) {
      console.log(route);
      this.$router.push({ path: route });
    },
    async getUserRoles() {
      await UserDataService.getUserRoles(this.user.userId)
        .then((response) => {
          // the data is sent back in an array. There should only be one object, hence the hard-code
          this.userWithRoles = response.data[0];
          this.userWithRoles.userRoles.forEach((role) => {
            this.userRoles.push(role.role);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    determineRoles() {
      for (let i = 0; i < this.menus.length; i++) {
        if (this.userRoles.includes(this.menus[i].title.toLowerCase())) {
          this.roleMenus.push(this.menus[i]);
          this.isExpanded.push(this.roleMenus.length - 1);
        }
      }
    },
  },
  async created() {
    this.user = Utils.getStore("user");

    await this.getUserRoles();
    this.determineRoles();
  },
});
</script>

<style scoped>
.v-expansion-panel-text__wrapper {
  padding: 0 !important;
  margin: 0;
}
</style>
