<template>
  <v-container v-if="!showingCritiqueForm" fluid class="bg-white">
    <h3 class="center">Select Timeslot for Critique</h3>
    <br />
    <h3 class="center">{{ getCurrentDate() }}</h3>
    <v-data-table :headers="headers" :items="timeslots" class="elevation-8">
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="handleClick(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-container>

  <v-container
    v-else-if="
      showingCritiqueForm &&
      showingExpandedForm == true &&
      popupTrigger == false
    "
    fluid
    class="bg-white"
  >
    <h2 class="center">Create Event Critique</h2>
    <br />
    <div class="d-flex justify-center">
      <v-btn variant="outlined" @click="showingExpandedForm = false"
        >Quick Form</v-btn
      >
    </div>
    <br />

    <v-form>
      <v-text-field
        clearable
        label="Deportment (poise, entrance/exit, bow)"
        v-model="deportmentComment"
      ></v-text-field>

      <v-select
        clearable
        label="Deportment Grade"
        v-model="deportmentGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Tone (beauty, control/clarity, vibrato, warmth)"
        v-model="toneComment"
      >
      </v-text-field>

      <v-select
        clearable
        label="Tone Grade"
        v-model="toneGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Accuracy/Intonation (correct notes with correct rhythm, tuning
        with keyboard and/or ensemble)"
        v-model="accuracy_intonationComment"
      ></v-text-field>

      <v-select
        clearable
        label="Accuracy/Intonation Grade"
        v-model="accuracy_intonationGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Technique (attacks, releases, flexibility, range, resonance, placement, support, agility)"
        v-model="techniqueComment"
      ></v-text-field>

      <v-select
        clearable
        label="Technique Grade"
        v-model="techniqueGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Interpretation & Musicianship (phrasing, tempo, dynamics
        communication, rapport)"
        v-model="interpretation_musicianshipComment"
      ></v-text-field>

      <v-select
        clearable
        label="Interpretation & Musicianship Grade"
        v-model="interpretation_musicianshipGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Balance & Blend (with accompanist or within ensemble)"
        v-model="balance_blendComment"
      ></v-text-field>

      <v-select
        clearable
        label="Balance & Blend Grade"
        v-model="balance_blendGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Diction/Articulation(vocal/instrumental)"
        v-model="diction_articulationComment"
      ></v-text-field>

      <v-select
        clearable
        label="Diction/Articulation Grade"
        v-model="diction_articulationGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Performance & Suggestions (overall readiness to
        perform)"
        v-model="overallPerformanceComment"
      ></v-text-field>

      <v-select
        clearable
        label="Overall Performance Grade"
        v-model="overallPerformanceGrade"
        :items="['A', 'B', 'C', 'D', 'F', '']"
      ></v-select>

      <br />
      <v-btn
        variant="outlined"
        style="margin-left: 25%; margin-bottom: 20px"
        @click="
          saveExpandedCritique()
          // isOpen = true;
        "
        >Save</v-btn
      >
      <!-- <teleport to="body">
        <div>
          <h3>Critique creation successful!</h3>
          <v-button @click="isOpen = false"></v-button>
        </div>
      </teleport> -->
      <v-btn
        variant="outlined"
        style="margin-left: 25%; margin-bottom: 20px"
        @click="cancelClick()"
        >Cancel</v-btn
      >
      <br /><br />
    </v-form>
  </v-container>

  <v-container
    v-else-if="
      showingCritiqueForm &&
      showingExpandedForm == false &&
      popupTrigger == false
    "
    fluid
    class="bg-white"
  >
    <h2 class="center">Create Event Critique</h2>
    <br />
    <div class="d-flex justify-center">
      <v-btn
        variant="outlined"
        style="margin-left: 50%; margin-right: 50%"
        @click="showingExpandedForm = true"
        >Expanded Form</v-btn
      >
    </div>
    <br />

    <v-form>
      <v-select
        clearable
        label="Deportment Grade"
        v-model="deportmentGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-select
        clearable
        label="Tone Grade"
        v-model="toneGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-select
        clearable
        label="Accuracy/Intonation Grade"
        v-model="accuracy_intonationGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-select
        clearable
        label="Technique Grade"
        v-model="techniqueGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-select
        clearable
        label="Interpretation & Musicianship Grade"
        v-model="interpretation_musicianshipGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-select
        clearable
        label="Balance & Blend Grade"
        v-model="balance_blendGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-select
        clearable
        label="Diction/Articulation Grade"
        v-model="diction_articulationGrade"
        :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
      ></v-select>

      <v-text-field
        clearable
        label="Performance & Suggestions (overall readiness to
        perform)"
        v-model="overallPerformanceComment"
      ></v-text-field>

      <v-select
        clearable
        label="Overall Performance Grade"
        v-model="overallPerformanceGrade"
        :items="['A', 'B', 'C', 'D', 'F', '']"
      ></v-select>

      <br />
      <v-btn
        variant="outlined"
        style="margin-left: 25%; margin-right: 25%; margin-bottom: 20px"
        @click="
          saveQuickCritique();
          popupTrigger = true;
          // isOpen = true;
        "
        >Save</v-btn
      >
      <!-- <teleport to="body">
        <div>
          <h3>Critique creation successful!</h3>
          <v-button @click="isOpen = false"></v-button>
        </div>
      </teleport> -->
      <v-btn variant="outlined" @click="cancelClick()">Cancel</v-btn>
    </v-form>
  </v-container>

  <v-container v-else-if="popupTrigger == true">
    <div>
      <h2 class="center" style="padding-top: 25%">
        Critique created successfully!
      </h2>
      <div class="d-flex justify-center" style="padding-top: 10px">
        <v-btn
          class="popup-close"
          variant="outlined"
          @click="
            popupTrigger = false;
            this.showingCritiqueForm = false;
          "
        >
          Close
        </v-btn>
      </div>
    </div>
  </v-container>
</template>

<script>
import EventDataService from "../services/EventDataService";
import CritiqueDataService from "../services/CritiqueDataService";
import Utils from "../config/utils.js";
import { ref } from "vue";

const isOpen = ref(false);
export default {
  name: "CreateCritique",
  data: () => ({
    user: {},
    itemsPerPage: 10,
    timeslots: [],
    selectedTimeslot: null,
    selectedCritique: null,
    showingCritiqueForm: false,
    showingExpandedForm: false,
    popupTrigger: false,
    deportmentComment: "",
    deportmentGrade: "",
    toneComment: "",
    toneGrade: "",
    accuracy_intonationComment: "",
    accuracy_intonationGrade: "",
    techniqueComment: "",
    techniqueGrade: "",
    interpretation_musicianshipComment: "",
    interpretation_musicianshipGrade: "",
    balance_blendComment: "",
    balance_blendGrade: "",
    diction_articulationComment: "",
    diction_articulationGrade: "",
    overallPerformanceComment: "",
    overallPerformanceGrade: "",

    headers: [
      {
        title: "Event Type",
        align: "start",
        sortable: true,
        key: "eventType",
      },
      {
        title: "First Name",
        align: "start",
        sortable: true,
        key: "students[0].fName",
      },
      {
        title: "Last Name",
        align: "start",
        sortable: true,
        key: "students[0].lName",
      },
      {
        title: "Instrument",
        align: "start",
        sortable: true,
        key: "students[0].instrumentName",
      },
      {
        title: "Type",
        align: "start",
        sortable: true,
        key: "students[0].instrumentType",
      },
      {
        title: "Create",
        key: "actions",
        sortable: false,
      },
    ],
  }),
  methods: {
    async retrieveTodaysTimeslots(date) {
      await EventDataService.getStudentTimeslotsForDate(date)
        .then((response) => {
          console.log(response.data.raw);
          for (let i = 0; i < response.data.length; i++) {
            let event = response.data[i];
            for (let j = 0; j < event.timeslots.length; j++) {
              let timeslot = event.timeslots[j];
              timeslot.eventType = event.eventType;
              this.timeslots.push(timeslot);
            }
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    getCurrentDate() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${month}/${day}/${year}`;
    },

    handleClick(item) {
      this.selectedTimeslot = item.raw;
      console.log(this.selectedTimeslot);
      this.showingCritiqueForm = true;
    },

    cancelClick() {
      //set all fields to blank state
      this.deportmentComment = "";
      this.deportmentGrade = "";

      this.toneComment = "";
      this.toneGrade = "";

      this.accuracy_intonationComment = "";
      this.accuracy_intonationGrade = "";

      this.techniqueComment = "";
      this.techniqueGrade = "";

      this.interpretation_musicianshipComment = "";
      this.interpretation_musicianshipGrade = "";

      this.balance_blendComment = "";
      this.balance_blendGrade = "";

      this.diction_articulationComment = "";
      this.diction_articulationGrade = "";

      this.overallPerformanceComment = "";
      this.overallPerformanceGrade = "";
      //change form state and go back to the studentTimeslots
      this.showingCritiqueForm = false;
    },

    saveQuickCritique() {
      console.log(this.deportmentGrade);
      console.log(this.selectedTimeslot);
      //individually sets each critique line variable JSON
      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let deportmentCritique = {
          type: "Deportment",
          grade: this.deportmentGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(deportmentCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let toneCritique = {
          type: "Tone",
          grade: this.toneGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(toneCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let accuracy_intonationCritique = {
          type: "Accuracy/Intonation",
          grade: this.accuracy_intonationGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(accuracy_intonationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let techniqueCritique = {
          type: "Technique",
          grade: this.techniqueGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(techniqueCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let techniqueCritique = {
          type: "Technique",
          grade: this.techniqueGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(techniqueCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let interpretation_musicianshipCritique = {
          type: "Interpretation & Musicianship",
          grade: this.interpretation_musicianshipGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(interpretation_musicianshipCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let balance_blendCritique = {
          type: "Balance & Blend",
          grade: this.balance_blendGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(balance_blendCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let diction_articulationCritique = {
          type: "Diction/Articulation",
          grade: this.diction_articulationGrade,
          comment: "N/A",
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(diction_articulationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let overallPerformanceCritique = {
          type: "Overall Performance & Suggestions",
          grade: this.overallPerformanceGrade,
          comment: this.overallPerformanceComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(overallPerformanceCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }
      this.popupTrigger = true;
      // this.showingCritiqueForm = false;
    },

    saveExpandedCritique() {
      console.log(this.deportmentGrade);
      console.log(this.selectedTimeslot);
      //individually sets each critique line variable JSON
      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let deportmentCritique = {
          type: "Deportment",
          grade: this.deportmentGrade,
          comment: this.deportmentComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(deportmentCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let toneCritique = {
          type: "Tone",
          grade: this.toneGrade,
          comment: this.toneComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(toneCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let accuracy_intonationCritique = {
          type: "Accuracy/Intonation",
          grade: this.accuracy_intonationGrade,
          comment: this.accuracy_intonationComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(accuracy_intonationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let techniqueCritique = {
          type: "Technique",
          grade: this.techniqueGrade,
          comment: this.techniqueComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(techniqueCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let techniqueCritique = {
          type: "Technique",
          grade: this.techniqueGrade,
          comment: this.techniqueComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(techniqueCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let interpretation_musicianshipCritique = {
          type: "Interpretation & Musicianship",
          grade: this.interpretation_musicianshipGrade,
          comment: this.interpretation_musicianshipComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(interpretation_musicianshipCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let balance_blendCritique = {
          type: "Balance & Blend",
          grade: this.balance_blendGrade,
          comment: this.balance_blendComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(balance_blendCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let diction_articulationCritique = {
          type: "Diction/Articulation",
          grade: this.diction_articulationGrade,
          comment: this.diction_articulationComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(diction_articulationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let overallPerformanceCritique = {
          type: "Overall Performance & Suggestions",
          grade: this.overallPerformanceGrade,
          comment: this.overallPerformanceComment,
          critiquerId: this.user.userId,
          timeslotId: this.selectedTimeslot.students[0].studentTimeslotId,
        };
        CritiqueDataService.create(overallPerformanceCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      this.popupTrigger = true;
      // this.showingCritiqueForm = false;
    },

    getComparisonDate() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${year}-${month}-${day}`;
    },
  },
  async mounted() {
    // this.retrieveTodaysTimeslots("2017-04-24");
    const currentDate = this.getComparisonDate();
    await this.retrieveTodaysTimeslots(this.getComparisonDate());
    this.user = Utils.getStore("user");
    console.log(this.user);
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
