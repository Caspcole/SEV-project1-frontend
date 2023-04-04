<template>
  <v-container fluid class="bg-white">
    <h2>Create Events</h2>
    <v-select v-model="type" @change="handleChange">
      <option v-for="text in options" :value="option.value"></option>
      {{ options.text }}
      <!-- v-model="selectedEventType" :items="type" item-text="name"
      item-value="type" label="Select Event Type" @change="handleChange"  this should work without this ;-;   > -->
    </v-select>
  </v-container>
  <!--// debug tool <p>You selected: {{ selectedEventType }}</p> -->

  <!-- date picker -->
  <v-container>
    <div>
      <v-app>
        <v-date-picker v-model="dateEntered"></v-date-picker>
      </v-app>
    </div>

    <!-- start/end time select -->
    <div>
      <h2>Event Start and End times:</h2>
      <v-row>
        <v-col style="width: 290px; flex: 0 1 auto">
          <h2>Start:</h2>
          <v-time-picker v-model="startTime" :max="endTime"></v-time-picker>
        </v-col>
        <v-col style="width: 290px; flex: 0 1 auto">
          <h2>End:</h2>
          <v-time-picker v-model="endTime" :min="startTime"></v-time-picker>
        </v-col>
      </v-row>
    </div>
  </v-container>

  <!-- Event timeslot duration -->
  <div>
    <label for="slotDuration"
      >Enter the desired time length of each slot (in minuets):</label
    >
    <input id="slotDuration" type="text" v-model="slotDuration" />
  </div>

  <!-- submit button -->

  <div>
    <v-row>
      <button @click="handleClick">Create Event</button>
    </v-row>
  </div>
</template>

<script>
import SemesterDataService from "../../services/EventDataService";

export default {
  name: "AdminCreateEvent",
  data() {
    return {
      user: {},
      timeslots: [],
      errorMessage: "",
      id: "",
      type: "",
      options: [
        { text: "Review", value: "review" },
        { text: "Jury", value: "jury" },
        { text: "Senior Review", value: "sReview" }, // can always make more types
      ],
      date: "",
      dateEntered: new Date().toISOString(),
      startTime: "",
      endTime: "",
      isVisable: "",
      canMergeSlots: "",
      slotDuration: "",
      semesterId: "",
    };
  },
  methods: {
    handleChange() {
      console.log("type:", this.options.value);
    },

    getCurrent() {},

    handleClick() {
      setSemester();

      if ((this.type = "")) {
        result = false;
        this.errorMessage = "error: please select an event type";
      } else if ((this.date = "")) {
        result = false;
        this.errorMessage = "error: please enter a date";
      } else if ((this.startTime = "")) {
        result = false;
        this.errorMessage = "error: please select a start time";
      } else if ((this.endTime = "")) {
        result = false;
        this.errorMessage = "error: please select an end time";
      } else if ((this.slotDuration = "")) {
        result = false;
        this.errorMessage =
          "error: please select a duration of time for each timeslot";
      } else if ((this.startTime = "")) {
        result = false;
        this.errorMessage = "error: please select a start time";
      }
    },
  },
};
</script>
