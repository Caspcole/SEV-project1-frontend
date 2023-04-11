<!-- Basically tutorialsList -->
<template>
  <v-container class="ma-5">
    <h2>Event Sign-Up</h2>
    <br />
    <p>
      Please select the event to sign-up for, then select a time slot(s) for
      that event.
    </p>
    <br />
    <v-container>
      <v-row>
        <v-col>
          <v-select
            clearable
            v-model="selectedStudentInstrument"
            label="Instrument"
            :items="studentInstruments"
            item-title="instrument.name"
            return-object
            :style="{ width: '250px' }"
            @update:modelValue="updateReturningObject"
          ></v-select>
        </v-col>
        <v-col>
          <h4>Instructor for selected instrument:</h4>
          <p>
            {{
              selectedStudentInstrument == null
                ? "No instrument selected"
                : selectedStudentInstrument.instructor.user.fName +
                  " " +
                  selectedStudentInstrument.instructor.user.lName
            }}
          </p>
          <h4>Accompanist for selected instrument:</h4>
          <p>
            {{
              selectedStudentInstrument == null
                ? "No Accompanist"
                : selectedStudentInstrument.accompanist.user.fName +
                  " " +
                  selectedStudentInstrument.accompanist.user.lName
            }}
          </p>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col>
          <!-- Make it so only the events in the future are shown -->
          <h3>Upcoming Events</h3>
          <br />
          <v-card height="500" width="300" class="scrollable">
            <v-btn
              v-for="event in events"
              :key="event.id"
              v-on:click="changeCurrentEvent(event)"
              variant="tonal"
              v-bind:color="event.id === currentEvent.id ? 'blue' : 'black'"
            >
              {{ event.type + " - " + event.date }}
            </v-btn>
          </v-card>

          <br />
        </v-col>
        <v-col>
          <!-- Make it so the event times can be scrolled through without scrolling through the entire page. 
          Next button would be under the time scrolling -->
          <h3>Avaliable Times</h3>
          <br />
          <v-card height="500" class="scrollable">
            <v-checkbox
              v-for="(time, index) in currentEventTimes"
              :key="index"
              v-model="selectedEventTimes"
              v-on:change="updateSelectedEventTimes()"
              :label="time.startTime.substring(0, 5)"
              :value="time"
            >
            </v-checkbox>
          </v-card>
          <br />

          <!-- Have some logic to grey out the button if there are no time slots selected -->
          <v-btn @click="nextPage">Next</v-btn>
          <!-- Need some logic to get the type of instrument the student is using -->
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import Utils from "../../config/utils.js";
import EventDataService from "../../services/EventDataService";
import EventTimeDataService from "../../services/EventTimeDataService";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
// change the name of EventTimeDataService to EventTimeslotDataService
export default {
  name: "student-event-list",
  data: () => ({
    dialog: false,
    search: "",
    events: [],
    selectedEvent: false,
    currentEvent: {},
    returningObject: {},
    currentEventTimes: [],
    selectedEventTimes: [],
    currentDate: new Date(),
    toSignUp: true,
    user: {},

    studentInstruments: [],
    selectedStudentInstrument: null,
  }),
  emits: ["SignUpForEventObject"],
  setup(props, { emit }) {
    const SignUpForEventObject = (returningObject) => {
      emit("SignUpForEventObject", returningObject);
    };
    return {
      SignUpForEventObject,
    };
  },
  methods: {
    changeCurrentEvent(event) {
      this.currentEvent = event;
      this.determineEventTimes();
      this.selectedEvent = true;
    },

    updateReturningObject() {
      if (this.selectedStudentInstrument) {
        this.returningObject.studentInstrument = this.selectedStudentInstrument;
      } else {
        delete this.returningObject.studentInstrument;
      }
    },

    async retrieveEventsDateAndAfter(date) {
      await EventDataService.getGTEDate(date)
        .then((response) => {
          this.events = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async retrieveEvents() {
      await EventDataService.getAll()
        .then((response) => {
          this.events = response.data;
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
    },
    async retrieveEventTimes(eventId) {
      await EventTimeDataService.getByEvent(eventId)
        .then((response) => {
          this.currentEventTimes = response.data;
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
    },

    async determineEventTimes() {
      this.selectedEventTimes = [];
      await this.retrieveEventTimes(this.currentEvent.id);
    },

    updateSelectedEventTimes() {
      this.returningObject = this.currentEvent;
      this.updateReturningObject();
      this.returningObject.eventTimes = this.selectedEventTimes;

      // Strip the ending seconds from the start and end times
      for (let i = 0; i < this.returningObject.eventTimes.length; i++) {
        this.returningObject.eventTimes[i].startTime =
          this.returningObject.eventTimes[i].startTime.substring(0, 5);
        this.returningObject.eventTimes[i].endTime =
          this.returningObject.eventTimes[i].endTime.substring(0, 5);
      }
    },

    async retrieveCourses() {
      await CourseDataService.getAll()
        .then((response) => {
          this.courses = response.data;
          this.filteredCourses = this.courses;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async retrieveStudentInstruments() {
      await StudentInstrumentDataService.getInstrumentAndInstructorAndAccompanistByUserId(
        this.user.userId
      )
        .then((response) => {
          this.studentInstruments = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    validation() {
      var isValid = true;
      if (!this.returningObject.hasOwnProperty("studentInstrument")) {
        isValid = false;
      } else if (!this.returningObject.hasOwnProperty("eventTimes")) {
        isValid = false;
      } else if (this.returningObject.eventTimes.length == 0) {
        isValid = false;
      }
      return isValid;
    },

    nextPage() {
      if (this.validation()) {
        this.SignUpForEventObject(this.returningObject);
      }
    },
  },
  async mounted() {
    this.currentDate = new Date();
    let dateString = this.currentDate.toISOString().substring(0, 10);
    await this.retrieveEventsDateAndAfter(dateString);

    this.user = Utils.getStore("user");
    await this.retrieveStudentInstruments();
  },
};
</script>
<style>
.list {
  text-align: left;
  max-width: 750px;
  margin: auto;
}
.scrollable {
  overflow-y: scroll;
}
</style>
