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
                <div
                  v-if="
                    header.title == 'Start Time' || header.title == 'End Time'
                  "
                >
                  {{ this.formatTime(item.columns[header.key]) }}
                </div>
                <div v-else-if="header.title != ' '">
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
  <v-dialog v-model="showDialog">
    <v-card>
      <v-card-title>
        <v-row>
          <v-col>
            {{ "Event Type: " + this.selectedEvent.type }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            {{ "Event Date: " + this.selectedEvent.date }}
          </v-col>
          <v-spacer></v-spacer>
          <v-col>
            {{
              "Times: (" +
              this.formatTime(this.selectedEvent.startTime) +
              " - " +
              this.formatTime(this.selectedEvent.endTime) +
              ")"
            }}
          </v-col>
        </v-row>
      </v-card-title>
      <v-divider></v-divider>
      <v-card-text>
        <v-row class="mt-4">
          <v-select
            class="mx-15"
            v-model="availabilityStart"
            label="Start Time"
            :items="availabilityStartArray"
            @update:modelValue="startTimeUpdated()"
          ></v-select>
          <v-select
            class="mx-15"
            v-model="availabilityEnd"
            label="End Time"
            :items="availabilityEndArray"
            @update:modelValue="endTimeUpdated()"
          ></v-select>
        </v-row>
        <v-data-table
          class="mt-4 elevation-1"
          :items="currentAvailability"
          :headers="availabilityHeader"
        ></v-data-table>
      </v-card-text>
    </v-card>
  </v-dialog>
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
    selectedEvent: null,
    user: {},
    showDialog: false,
    availabilityStart: null,
    availabilityStartArray: [],
    availabilityEnd: null,
    availabilityEndArray: [],
    currentAvailability: [],
    availabilityHeader: [
      { title: "Start Time", key: "startTime", sortable: false },
      { title: "End Time", key: "endTime", sortable: false },
      { title: "actions", sortable: false, allign: "end" },
    ],
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
      this.selectedEvent = event;
      this.showDialog = true;
    },
    formatTime(time) {
      if (time == undefined) {
        return;
      }
      var h1 = Number(time[0] - "0");
      var h2 = Number(time[1] - "0");
      var result = "";

      var hh = h1 * 10 + h2;

      // Finding out the Meridien of time
      // ie. AM or PM
      var meridien;

      if (hh < 12) {
        meridien = "AM";
      } else meridien = "PM";

      hh %= 12;

      // Handle 00 and 12 case separately
      if (hh == 0) {
        result += "12";

        // Printing minutes and seconds
        for (var i = 2; i < 8; ++i) {
          result += time[i];
        }
      } else {
        result += hh;
        // Printing minutes and seconds
        for (var i = 2; i < 8; ++i) {
          result += time[i];
        }
      }

      result += " " + meridien;
      return result;
    },
    startTimeUpdated() {},
    endTimeUpdated() {},
  },
  async mounted() {
    this.user = Utils.getStore("user");
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);
  },
};
</script>
