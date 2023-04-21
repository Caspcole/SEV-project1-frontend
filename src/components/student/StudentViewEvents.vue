<template>
  <v-container fluid class="bg-white">
    <v-col>
      <v-toolbar-title>UPCOMING EVENTS</v-toolbar-title>

      <h3 class="center">{{ this.user.fname }}</h3>

      <v-data-table :headers="headers" :items="headers.key" class="elevation-8">
      </v-data-table>
    </v-col>
  </v-container>
  <br />
  <br />
</template>

<script>
import EventDataService from "../../services/EventDataService";
import Utils from "../../config/utils.js";
export default {
  name: "",
  components: {},
  data: () => ({
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Timeslot", key: "startTime" },
    ],
    date: "",
    user: {},
    semesterId: "",
    userId: "",
  }),

  async retrieveEventsDateAndAfter(date) {
    await EventDataService.getGTEDate(date)
      .then((response) => {
        this.events = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  },

  async mounted() {
    this.user = Utils.getStore("user");
    // this.retrieveAllSemesters();
  },

  async retrieveEvents() {
    await EventDataService.getAll(this.user.userId)
      .then((headers) => {
        this.events = headers.data;
        // console.log(this.events);
      })
      .catch((e) => {
        console.log(e);
      });
  },
};
</script>
