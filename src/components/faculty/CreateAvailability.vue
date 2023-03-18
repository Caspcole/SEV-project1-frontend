<template>
  <v-card>
    <v-card-title> Event Availability: </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table :headers="headers" :items="events" class="elevation-1">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>UPCOMING EVENTS</v-toolbar-title>
            </v-toolbar>
          </template>
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in headers" :key="index">
                <div v-if="header.title != ' '">
                  {{ item.columns[header.key] }}
                </div>
                <div v-else>
                  <v-btn
                    small
                    color="primary"
                    @click="displayEventAvailability(item.raw)"
                    >Create Availability</v-btn
                  >
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="showDialog"><v-card>test</v-card></v-dialog>
</template>
<script>
import EventDataService from "../../services/EventDataService";
import Utils from "../../config/utils.js";
export default {
  name: "createAvailability",
  data: () => ({
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: " " },
    ],
    events: [],
    user: {},
    showDialog: false,
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
    displayEventAvailability(event) {
      this.showDialog = true;
    },
  },
  async mounted() {
    this.user = Utils.getStore("user");
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);
  },
};
</script>
