<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col cols="2" class="bg-blue">
        <MainNav @changeComp="changeComponent"></MainNav>
      </v-col>
      <v-col cols="10" class="bg-white">
        <!-- Your components go here -->
        <div class="grid-container">
          <StudentHome v-if="route === 'Repertoire'"></StudentHome>
          <TestEx v-else-if="route === 'Your Events'"></TestEx>
          <AdminCreateEvent
            v-else-if="route === 'Create Event'"
          ></AdminCreateEvent>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// Import all components and insert into homepage
import MainNav from "../components/MainNav.vue";
import StudentHome from "../components/StudentHome.vue";
import TestEx from "../components/TestEx.vue";
import AdminCreateEvent from "../components/AdminCreateEvent.vue";

export default {
  name: "HomeView",
  components: {
    MainNav, //Left navigation panel
    StudentHome, //Landing Page for the Students
    TestEx,
    AdminCreateEvent,
  },
  data: () => ({
    role: "",
    route: "",
  }),
  created() {},
  methods: {
    changeComponent(link) {
      console.log(link);
      this.route = link;
      console.log(this.route === "Repertoire");
    },
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
