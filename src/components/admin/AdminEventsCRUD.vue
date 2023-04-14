<template>
  <v-container>
    <v-card>
      <v-card-title class="d-flex justify-center"> View Events </v-card-title>
    </v-card>
  </v-container>
  <v-container>
    <v-row>
      <v-col cols="2">
        <v-card>
          <v-select
            v-model="selectedSemester"
            label="Semester"
            :items="semesters"
            item-value="id"
            item-title="title"
            @update:modelValue="semesterSearchUpdate(selectedSemester)"
            style="background-color: whitesmoke"
          ></v-select>
        </v-card>
      </v-col>
      <v-col> </v-col>
      <v-col cols="2">
        <v-btn color="primary" @click="displayCreateEvent(item)">
          Create Event
        </v-btn>
      </v-col>
    </v-row>
  </v-container>

  <v-container>
    <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers="headers"
            :items="filteredEvents"
            class="elevation-1"
          >
            <template v-slot:top>
              <v-toolbar flat>
                <v-toolbar-title>EVENTS</v-toolbar-title>
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
                  <div v-else-if="header.title != 'Edit'">
                    {{ item.columns[header.key] }}
                  </div>
                  <div v-else>
                    <v-icon
                      size="small"
                      class="me-2"
                      color="primary"
                      @click="displayEditEvent(item.raw)"
                      >mdi-pencil</v-icon
                    >
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <!-- Create dialog popup -->
  <v-dialog v-model="createDialog" :style="{ width: '1000px' }" class="mx-auto">
    <v-card>
      <v-card>
        <v-card-title class="d-flex justify-center">Create Event</v-card-title>
      </v-card>
      <v-card-text>
        <v-row class="ml-5">
          <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        </v-row>
        <v-row>
          <v-select
            v-model="eventType"
            label="Event Type"
            :items="[
              'Jury',
              'Recital Hearing',
              'Capstone Hearing',
              'Scholarship Hearing',
            ]"
            :style="{ width: '40px' }"
            clearable
            return-object
          ></v-select>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-select
            v-model="eventStartTime"
            label="Start Time"
            :items="startTime"
            :style="{ width: '40px' }"
            return-object
            @update:modelValue="startTimeUpdated()"
          ></v-select>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-select
            v-model="eventEndTime"
            label="End Time"
            :items="endTime"
            :style="{ width: '40px' }"
            return-object
          ></v-select>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-select
            v-model="createEventSemester"
            label="Semester"
            :items="eventCreateSemesters"
            item-value="id"
            item-title="title"
            @update:modelValue="eventSemesterSelection()"
            return-object
          ></v-select>
          <!-- Add a date selector somehow?? -->
        </v-row>
        <v-divider></v-divider>
        <v-row>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col cols="4"> </v-col>
          <v-col cols="4">
            <v-text-field
              type="date"
              clearable="true"
              v-model="pickedDate"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col></v-col>
        </v-row>
        <v-row>
          <v-col class="d-flex justify-center">
            <v-btn
              class="d-flex justify-center"
              color="primary"
              @click="createEvent()"
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
      <v-divider></v-divider>
    </v-card>
  </v-dialog>
</template>
<script>
import EventDataService from "../../services/EventDataService";
import Utils from "../../config/utils.js";
import AvailabilityDataService from "../../services/AvailabilityDataService";
import SemesterDataService from "../../services/SemesterDataService";

export default {
  name: "createAvailability",
  data: () => ({
    headers: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Edit", key: "actions", sortable: false },
    ],
    selectedEvent: null,
    user: {},
    showDialog: false,

    //Filter logic
    //----------------------
    // studentFilterArray: [],
    // studentFilter: null,
    selectedSemester: null,
    semesters: [],
    typeFilterArray: [],
    typeFilter: null,
    monthFilterArray: [],
    monthFilter: null,
    semesterEvents: [],
    filteredEvents: [],

    errorMessage: "",
    createDialog: false,
    editDialog: false,

    timeSlots: [],
    eventType: null,
    eventTypeArray: [],
    eventStartTime: null,
    startTime: [],
    eventEndTime: null,
    endTime: [],
    createEventSemester: null,
    eventCreateSemesters: [],
    eventSemester: [],

    pickedDate: null,
  }),
  methods: {
    fillTimeArrays() {
      this.timeSlots = [];
      let tempTime = "08:00:00";

      while (tempTime <= "17:00:00") {
        this.timeSlots.push({
          title: this.formatTime(tempTime),
          value: tempTime,
        });
        tempTime = this.addDurationMinutes(tempTime);
      }

      this.endTime = Array.from(this.timeSlots);
      this.startTime = Array.from(this.timeSlots);

      this.endTime.shift(); //removes the first timeslot from the end array
      this.startTime.pop(); //removes the last timeslot from the start array

      this.eventStartTime = this.timeSlots[0];
    },

    displayCreateEvent() {
      this.errorMessage = "";
      this.fillTimeArrays();

      this.createDialog = true;
    },
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
          this.eventCreateSemesters = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getCurrentSemester() {
      this.currentDate = new Date();
      let dateString = this.currentDate.toISOString().substring(0, 10);
      await SemesterDataService.getCurrent(dateString)
        .then((response) => {
          this.selectedSemester = this.semesters.find(
            (obj) => obj.id == response.data[0].id
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    createEvent() {},
    async semesterSearchUpdate(semester) {
      await EventDataService.getSemesterEvents(semester) // change
        .then((response) => {
          this.filteredEvents = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async eventSemesterSelection() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesterEvents = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async retrieveEvents(date) {
      await EventDataService.getAll(date)
        .then((response) => {
          this.filteredEvents = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },

    addDurationMinutes(time) {
      let timeSplit = time.split(":");
      let hour = Number(timeSplit[0]);
      let minute = Number(timeSplit[1]) + Number(10);

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
      this.endTime = [];
      this.endTime = this.timeSlots.filter(
        (obj) => obj.value >= this.eventStartTime.value
      );

      this.endTime.shift(); //removes the first timeslot from the end array

      if (!this.endTime.includes(this.eventEndTime)) {
        this.eventEndTime = null;
      }
    },
  },
  async mounted() {
    this.user = Utils.getStore("user");
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));

    this.currentDate = new Date();

    await this.getCurrentSemester();
    await this.semesterSearchUpdate(this.selectedSemester.id);
  },
};
</script>
