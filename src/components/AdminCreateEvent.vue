<template>
  <v-container fluid class="bg-white">
    <h2>Create Events</h2>
    <v-select v-model="type" @change="handleChange">
      <option v-for="text in options" :value="option.value"></option>
      <!-- {{ options.text }} -->

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
      >Enter the desired time limit of each slot (in minuets):</label
    >
    <input id="slotDuration" type="text" v-model="slotDuration" />
  </div>

  <!-- is mergeable -->
  <h2>Can the time slots be merged (instraments)</h2>
  <v-select v-model="canMergeSlots" @change="handleChangeMerge">
    <option
      v-for="textM in mergeOptions"
      :valueM="meregeOption.Mvalue"
    ></option>
  </v-select>

  <!-- submit button -->

  <div>
    <v-row>
      <button @click="handleClick">Create Event</button>
    </v-row>
  </div>
</template>

<script>
import SemesterDataService from "./../services/EventDataService.js";
import EventDataService from "./../services/EventDataService.js";

export default {
  name: "AdminCreateEvent",
  data() {
    return {
      user: {},
      timeslots: [],
      errorMessage: "",
      type: "",
      options: [
        { text: "Review", value: "review" },
        { text: "Jury", value: "jury" },
        { text: "Senior Review", value: "sReview" }, // can always make more types
      ],
      mergeOptions: [
        { textM: "Yes", valueM: true },
        { textM: "No", valueM: false },
      ],
      date: "",
      dateEntered: new Date().toISOString(),
      startTime: "",
      endTime: "",
      isVisable: true,
      canMergeSlots: false,
      slotDuration: "",
      semesterId: "",
    };
  },
  methods: {
    handleChange() {
      console.log("type:", this.options.value);
    },

    handleChangeMerge() {
      console.log("canMergeSlots:", this.mergeOptions.value);
    },
    validateData() {
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
      } else if ((this.semesterId = "")) {
        result = false;
        this.errorMessage = "error : semester not found";
      } else if ((this.isVisable = "")) {
        result = false;
        this.errorMessage = "error : enter weather the event is visable or not";
      } else if ((this.canMergeSlots = "")) {
        result = false;
        this.errorMessage = "error : mergability has not been entered";
      }
    },
    setDate() {
      console.log("date:", this.dateEntered);
    },

    handleClick() {
      SemesterDataService.getCurrent(date); //is in semester data service
      if (!this.validateData());
      {
        createEvent();
      }
      els;
    },
    async createEvent() {
      var data = {
        date: dateEntered,
        isVisible: 1,
        type: options.value,
        startTime: startTime,
        endTime: endtime,
        canMergeSlots: canMergeSlots,
        slotDuration: slotDuration,
      };

      // SemesterDataService.create(data);
    },
  },
};
</script>
