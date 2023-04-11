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
                    <v-btn
                      small
                      color="primary"
                      @click="displayEditEvent(item.raw)"
                      >Edit Event</v-btn
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
            :items="eventTypeArray"
            :style="{ width: '40px' }"
            return-object
          ></v-select>
          <v-select
            v-model="eventStartTime"
            label="Start Time"
            :items="startTime"
            :style="{ width: '40px' }"
            return-object
            @update:modelValue="startTimeUpdated()"
          ></v-select>
          <v-select
            v-model="eventEndTime"
            label="End Time"
            :items="endTime"
            :style="{ width: '40px' }"
            return-object
          ></v-select>
          <v-select
            v-model="createEventSemester"
            label="Semester"
            :items="eventCreateSemesters"
            item-value="id"
            item-title="title"
          ></v-select>
          <!-- Add a date selector somehow?? -->
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
  }),
  methods: {
    displayCreateEvent(event) {
      this.errorMessage = "";
      this.selectedEvent = event;

      this.createDialog = true;
    },
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
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
    async retrieveEventsDateAndAfter(date) {
      await EventDataService.getGTEDate(date)
        .then((response) => {
          this.filteredEvents = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async retrieveEventsDateAndBefore(date) {
      await EventDataService.getLTEDate(date)
        .then((response) => {
          this.filteredEvents = response.data;
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
      this.availabilityEndArray = this.availabilitySlots.filter(
        (obj) => obj.value >= this.availabilityStart.value
      );

      this.availabilityEndArray.shift(); //removes the first timeslot from the end array

      if (!this.availabilityEndArray.includes(this.availabilityEnd)) {
        this.availabilityEnd = null;
      }
    },
    createAvailability() {
      if (this.availabilityEnd == undefined) {
        this.errorMessage = "Please select an End Time";
        return;
      }
      const data = {
        date: this.selectedEvent.date,
        startTime: this.availabilityStart.value,
        endTime: this.availabilityEnd.value,
        userId: this.user.userId,
        eventId: this.selectedEvent.id,
      };
      if (!this.checkForOverlap(data)) {
        AvailabilityDataService.create(data)
          .then((response) => {
            this.errorMessage = "";
            this.currentAvailability.push(response.data);
            this.userAvailability.push(response.data);
          })
          .catch((e) => {
            console.log(e);
          });
      } else {
        this.errorMessage =
          "That time would overlap with an existing time. Please try again";
      }
    },
    checkForOverlap(entry) {
      var result = false;
      if (entry.id == undefined) {
        this.currentAvailability.forEach((obj) => {
          if (!result) {
            if (
              (entry.startTime <= obj.startTime &&
                entry.endTime > obj.startTime) ||
              (entry.startTime > obj.startTime && entry.startTime < obj.endTime)
            ) {
              result = true;
            }
          }
        });
      } else {
        this.currentAvailability.forEach((obj) => {
          if (!result) {
            if (
              (entry.startTime <= obj.startTime &&
                entry.endTime > obj.startTime) ||
              (entry.startTime > obj.startTime && entry.startTime < obj.endTime)
            ) {
              if (obj.id != entry.id) {
                result = true;
              }
            }
          }
        });
      }
      return result;
    },
    deleteItem(item) {
      this.editedIndex = this.currentAvailability.indexOf(item);
      this.editedAvail = item;
      this.dialogDelete = true;
    },
    deleteItemConfirm() {
      AvailabilityDataService.remove(
        this.currentAvailability[this.editedIndex].id
      ).catch((error) => {
        console.log(error);
      });
      this.userAvailability.splice(
        this.userAvailability.indexOf(
          this.currentAvailability[this.editedIndex]
        ),
        1
      );
      this.currentAvailability.splice(this.editedIndex, 1);
      this.closeDelete();
    },
    closeDelete() {
      this.dialogDelete = false;
      this.$nextTick(() => {
        this.editedAvail = null;
        this.editedIndex = -1;
      });
    },
    editItem(item) {
      this.editedIndex = this.currentAvailability.indexOf(item);
      this.editedAvail = item;
      this.editSelectedStart = this.availabilitySlots.find(
        (obj) => obj.value == this.editedAvail.startTime
      );
      this.editSelectedEnd = this.availabilitySlots.find(
        (obj) => obj.value == this.editedAvail.endTime
      );

      this.editStartOriginal = this.editSelectedStart.title;
      this.editEndOriginal = this.editSelectedEnd.title;

      this.editStartChange();
      this.dialogEdit = true;
    },
    editStartChange() {
      this.editEndArray = this.availabilitySlots.filter(
        (obj) => obj.value >= this.editSelectedStart.value
      );

      this.editEndArray.shift(); //removes the first timeslot from the end array

      if (!this.editEndArray.includes(this.editSelectedEnd)) {
        this.editSelectedEnd = null;
      }
    },
    editItemConfirm() {
      if (this.editSelectedEnd == undefined) {
        this.editErrorMessage = "Please select an End Time";
        return;
      }
      const index = this.userAvailability.indexOf(
        this.currentAvailability[this.editedIndex]
      );
      const data = {
        id: this.editedAvail.id,
        startTime: this.editSelectedStart.value,
        endTime: this.editSelectedEnd.value,
      };
      if (this.checkForOverlap(data)) {
        this.editErrorMessage =
          "That time would overlap with an existing time. Please try again";
      } else {
        AvailabilityDataService.update(data).catch((error) => {
          console.log(error);
        });
        this.currentAvailability[this.editedIndex].startTime = data.startTime;
        this.currentAvailability[this.editedIndex].endTime = data.endTime;
        this.userAvailability[index].startTime = data.startTime;
        this.userAvailability[index].endTime = data.endTime;

        this.closeEdit();
      }
    },
    closeEdit() {
      this.editErrorMessage = "";
      this.dialogEdit = false;
      this.$nextTick(() => {
        this.editedAvail = null;
      });
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
