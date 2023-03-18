<template>
  <v-card>
    <v-card-title> Event Availability: </v-card-title>
  </v-card>
</template>
<script>
import EventDataService from "../../services/EventDataService";
export default {
  name: "createAvailability",
  data: () => ({
    events: [],
  }),
  methods: {
    async retrieveEventsDateAndAfter(date) {
      await EventDataService.getGTEDate(date)
        .then((response) => {
          this.events = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  async mounted() {
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);
  },
};
</script>
