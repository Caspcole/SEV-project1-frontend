<!-- Basically tutorialsList -->
<template>
  <v-dialog v-model="displayError" width="450px" class="text-center">
    <v-card>
      <v-card-text> "{{ errorMessage }}" </v-card-text>
      <v-card-actions>
        <v-btn color="primary" block @click="closeDialog">Close Dialog</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-container class="ma-5">
    <v-card>
      <v-card-title class="d-flex justify-center">Event Sign-Up</v-card-title>
      <v-card-text class="d-flex justify-center"
        >Please select your instrument, then the event to sign-up for, then
        select a time slot(s) for that event.
      </v-card-text>
    </v-card>
    <br />
    <v-card>
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
              @update:modelValue="updateStudentInstrument"
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
              {{ selectedAccompanist() }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-container v-if="showEvents">
      <v-row>
        <v-col>
          <!-- Make it so only the events in the future are shown -->
          <v-card width="300" class="d-flex justify-center">
            <v-card-title>Upcoming Events</v-card-title>
          </v-card>
          <br />
          <v-card height="500" width="300" class="scrollable">
            <v-btn
              v-for="event in events"
              :key="event.id"
              v-model="selectedEvent"
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
          <v-card>
            <v-card-title class="d-flex justify-center"
              >Available Times</v-card-title
            >
          </v-card>
          <br />
          <v-card height="500" class="scrollable">
            <v-checkbox
              v-for="(time, index) in currentEventTimes"
              :key="index"
              v-model="selectedEventTimes"
              v-on:change="updateSelectedEventTimes()"
              :label="labelEventTimes(time)"
              :value="time"
              v-bind:disabled="disableEventtimes(time)"
              v-bind:color="'green'"
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
import AvailabilityDataService from "../../services/AvailabilityDataService";
import { setBlockTracking } from "vue";
// change the name of EventTimeDataService to EventTimeslotDataService
export default {
  name: "student-event-list",
  data: () => ({
    dialog: false,
    search: "",
    events: [],
    selectedEvent: [],
    currentEvent: {},
    returningObject: {},
    currentEventTimes: [],
    selectedEventTimes: [],
    currentDate: new Date(),
    toSignUp: true,
    user: {},
    errorMessage: "",
    displayError: false,
    showEvents: false,

    studentInstruments: [],
    selectedStudentInstrument: null,

    instructorAvailability: { temp: true },
    accompanistAvailability: { temp: true },
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
    async changeCurrentEvent(event) {
      this.currentEvent = event;
      await this.determineAvailabilities(event);
      this.determineEventTimes();
      // this.selectedEvent = true;
    },

    selectedAccompanist() {
      let returnString = "";

      if (this.selectedStudentInstrument == null) {
        returnString = "No accompanist";
      } else if (
        "accompanist" in this.selectedStudentInstrument &&
        this.selectedStudentInstrument.accompanist
      ) {
        returnString =
          this.selectedStudentInstrument.accompanist.user.fName +
          "  " +
          this.selectedStudentInstrument.accompanist.user.lName;
      } else {
        returnString = "No accompanist for this instrument.";
      }
      return returnString;
    },

    async determineAvailabilities(event) {
      let date = event.date;
      // grab accompanist and instructor availabilities
      await this.retrieveInstructorAvailability(
        this.selectedStudentInstrument.instructor.user.id,
        date
      );
      if (
        "accompanist" in this.selectedStudentInstrument &&
        this.selectedStudentInstrument.accompanist
      ) {
        await this.retrieveAccompanistAvailability(
          this.selectedStudentInstrument.accompanist.user.id,
          date
        );
      }
    },

    disableEventtimes(time) {
      let isDisabled = true;

      if (time.studentTimeslots.length == 0) {
        if (this.instructorAvailability && this.accompanistAvailability) {
          if (
            "id" in this.instructorAvailability &&
            "id" in this.accompanistAvailability
          ) {
            if (
              time.startTime
                .substring(0, 5)
                .localeCompare(
                  this.instructorAvailability.startTime.substring(0, 5)
                ) >= 0 &&
              time.startTime
                .substring(0, 5)
                .localeCompare(
                  this.instructorAvailability.endTime.substring(0, 5)
                ) <= 0 &&
              time.startTime
                .substring(0, 5)
                .localeCompare(
                  this.accompanistAvailability.startTime.substring(0, 5)
                ) >= 0 &&
              time.startTime
                .substring(0, 5)
                .localeCompare(
                  this.accompanistAvailability.endTime.substring(0, 5)
                ) <= 0
            ) {
              isDisabled = false;
            }
          } else if (
            "id" in this.instructorAvailability &&
            !("id" in this.accompanistAvailability)
          ) {
            if ("id" in this.instructorAvailability) {
              if (
                time.startTime
                  .substring(0, 5)
                  .localeCompare(
                    this.instructorAvailability.startTime.substring(0, 5)
                  ) >= 0 &&
                time.startTime
                  .substring(0, 5)
                  .localeCompare(
                    this.instructorAvailability.endTime.substring(0, 5)
                  ) <= 0
              ) {
                isDisabled = false;
              }
            }
          }
        }
      }

      return isDisabled;
    },

    labelEventTimes(time) {
      let returnString = time.startTime.substring(0, 5);

      if (time.studentTimeslots.length > 0) {
        returnString = returnString + " Taken";
      }

      if (this.instructorAvailability) {
        if ("id" in this.instructorAvailability) {
          if (
            time.startTime
              .substring(0, 5)
              .localeCompare(
                this.instructorAvailability.startTime.substring(0, 5)
              ) >= 0 &&
            time.startTime
              .substring(0, 5)
              .localeCompare(
                this.instructorAvailability.endTime.substring(0, 5)
              ) <= 0
          ) {
            returnString = returnString + ", Instr. available";
          }
        }
      }

      if (this.accompanistAvailability) {
        if ("id" in this.accompanistAvailability) {
          if (
            time.startTime
              .substring(0, 5)
              .localeCompare(
                this.accompanistAvailability.startTime.substring(0, 5)
              ) >= 0 &&
            time.startTime
              .substring(0, 5)
              .localeCompare(
                this.accompanistAvailability.endTime.substring(0, 5)
              ) <= 0
          ) {
            returnString = returnString + ", Accomp. available";
          }
        }
      }

      return returnString;
    },

    closeDialog() {
      this.errorMessage = "";
      this.displayError = false;
    },

    updateStudentInstrument() {
      this.updateReturningObject();
      this.currentEvent = {};
      this.currentEventTimes = [];
    },

    updateReturningObject() {
      if (this.selectedStudentInstrument) {
        this.showEvents = true;
        this.returningObject.studentInstrument = this.selectedStudentInstrument;
      } else {
        this.showEvents = false;
        delete this.returningObject.studentInstrument;
      }
    },

    async retrieveInstructorAvailability(userId, date) {
      await AvailabilityDataService.getByUserAndDate(userId, date)
        .then((response) => {
          this.instructorAvailability = response.data[0];
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async retrieveAccompanistAvailability(userId, date) {
      await AvailabilityDataService.getByUserAndDate(userId, date)
        .then((response) => {
          this.accompanistAvailability = response.data[0];
        })
        .catch((e) => {
          console.log(e);
        });
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
      await EventTimeDataService.getEventTimeslotsAndStudentTimeslotsByEvent(
        eventId
      )
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
        isValid = this.notValid();
        this.errorMessage = "Please select an instrument.";
      } else if (!this.returningObject.hasOwnProperty("eventTimes")) {
        isValid = this.notValid();
        this.errorMessage = "Please select an event and time slot.";
      } else if (this.returningObject.eventTimes.length == 0) {
        isValid = this.notValid();
        this.errorMessage = "Please select an event time slot.";
      }
      return isValid;
    },

    notValid() {
      this.displayError = true;
      return false;
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
