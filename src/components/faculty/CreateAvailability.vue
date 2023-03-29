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
                <div v-else-if="header.title != 'Actions'">
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
  <v-dialog v-model="showDialog" :style="{ width: '875px' }" class="mx-auto">
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
        <v-row class="mt-4 ml-5">
          <v-select
            v-model="availabilityStart"
            label="Start Time"
            :items="availabilityStartArray"
            :style="{ width: '40px' }"
            @update:modelValue="startTimeUpdated()"
          ></v-select>
          <v-select
            class="ml-15"
            v-model="availabilityEnd"
            label="End Time"
            :items="availabilityEndArray"
            :style="{ width: '40px' }"
          ></v-select>
          <v-spacer></v-spacer>
        </v-row>
        <v-row class="ml-5">
          <v-btn color="primary" @click="createAvailability()"
            >Create Availability</v-btn
          >
          <v-spacer></v-spacer>
        </v-row>
        <v-data-table
          class="mt-15 elevation-1"
          :items="currentAvailability"
          :headers="availabilityHeader"
        >
          <template #top>
            <v-toolbar flat>
              <v-toolbar-title> AVAILABILITY </v-toolbar-title>
              <div v-if="currentAvailability.length == 0" class="mr-4">
                <v-spacer></v-spacer>
                You currently have no availability for this event.
              </div>
            </v-toolbar>
          </template>
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in availabilityHeader" :key="index">
                <div
                  v-if="
                    header.title == 'Start Time' || header.title == 'End Time'
                  "
                >
                  {{ this.formatTime(item.columns[header.key]) }}
                </div>
                <div v-else>
                  <v-icon size="small" class="me-2" @click="editItem(item.raw)">
                    mdi-pencil
                  </v-icon>
                  <v-icon size="small" @click="deleteItem(item.raw)">
                    mdi-delete
                  </v-icon>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5"
              >Are you sure you want to delete this item?</v-card-title
            >
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
                >Cancel</v-btn
              >
              <v-btn
                color="blue-darken-1"
                variant="text"
                @click="deleteItemConfirm"
                >OK</v-btn
              >
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
import EventDataService from "../../services/EventDataService";
import Utils from "../../config/utils.js";
import AvailabilityDataService from "../../services/AvailabilityDataService";
export default {
  name: "createAvailability",
  data: () => ({
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", key: "actions", sortable: false },
    ],
    events: [],
    selectedEvent: null,
    user: {},
    showDialog: false,
    userAvailability: [],
    availabilitySlots: [],
    availabilityStart: null,
    availabilityStartArray: [],
    availabilityEnd: null,
    availabilityEndArray: [],
    currentAvailability: [],
    availabilityHeader: [
      { title: "Start Time", key: "startTime", sortable: false },
      { title: "End Time", key: "endTime", sortable: false },
      { title: "Actions", sortable: false, allign: "end" },
    ],
    dialogDelete: false,
    editedAvail: null,
    editedIndex: 0,
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
    async getAvailabilityForUser() {
      await AvailabilityDataService.getByUser(this.user.userId)
        .then((response) => {
          this.userAvailability = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    displayEventAvailability(event) {
      this.selectedEvent = event;
      this.fillAvailabilityArrays();
      this.currentAvailability = this.userAvailability.filter(
        (obj) => obj.eventId == event.id
      );
      this.showDialog = true;
    },
    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    fillAvailabilityArrays() {
      this.availabilitySlots = [];
      let tempTime = this.selectedEvent.startTime;

      while (tempTime <= this.selectedEvent.endTime) {
        const obj = { title: this.formatTime(tempTime), value: tempTime };
        this.availabilitySlots.push(obj);
        this.availabilityStartArray.push(obj);
        tempTime = this.addDurationMinutes(tempTime);
      }

      this.availabilityEndArray = this.availabilitySlots;

      this.availabilityEndArray.shift(); //removes the first timeslot from the end array
      this.availabilityStartArray.pop(); //removes the last timeslot from the start array

      this.availabilityStart = this.availabilityStartArray[0];
    },
    addDurationMinutes(time) {
      let timeSplit = time.split(":");
      let hour = Number(timeSplit[0]);
      let minute =
        Number(timeSplit[1]) + Number(this.selectedEvent.slotDuration);

      if (minute >= "60") {
        hour++;
        minute -= 60;
      }

      return (
        hour.toString().padStart(2, "0") +
        ":" +
        minute.toString().padStart(2, "0") +
        ":00"
      );
    },
    startTimeUpdated() {
      this.availabilityEndArray = [];
      this.availabilityEnd = null;
      this.availabilityEndArray = this.availabilitySlots.filter(
        (obj) => obj.value >= this.availabilityStart
      );
      this.availabilityEndArray.shift(); //removes the first timeslot from the end array
    },
    createAvailability() {
      const data = {
        date: this.selectedEvent.date,
        startTime:
          this.availabilityStart.value == undefined
            ? this.availabilityStart
            : this.availabilityStart.value,
        endTime: this.availabilityEnd,
        userId: this.user.userId,
        eventId: this.selectedEvent.id,
      };
      AvailabilityDataService.create(data)
        .then((response) => {
          this.currentAvailability.push(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    },
    deleteItemConfirm() {
      this.currentAvailability.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedItem = null;
        this.editedIndex = -1;
      });
    },
  },
  async mounted() {
    this.user = Utils.getStore("user");
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);
    await this.getAvailabilityForUser();
  },
};
</script>
