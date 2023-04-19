<template>
  <v-container v-model="selectingEventTitle">
    <v-card>
      <v-card-title class="d-flex justify-center"> Select Event </v-card-title>
    </v-card>
  </v-container>

  <v-container v-model="selectingEventSemester">
    <v-row>
      <v-col cols="3">
        <v-card>
          <v-select
            v-model="selectedSemester"
            label="Semester"
            :items="selectCurrentSemester"
            item-value="id"
            item-title="title"
            @update:modelValue="semesterSearchUpdate(selectedSemester)"
            style="background-color: whitesmoke"
            disabled
          ></v-select>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-model="selectingEvent">
    <v-row>
      <v-col>
        <v-card>
          <v-data-table
            :headers="selectingEventHeaders"
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
                <td
                  v-for="(header, index) in selectingEventHeaders"
                  :key="index"
                >
                  <div
                    v-if="
                      header.title == 'Start Time' || header.title == 'End Time'
                    "
                  >
                    {{ this.formatTime(item.columns[header.key]) }}
                  </div>
                  <div v-else-if="header.title != 'Select'">
                    {{ item.columns[header.key] }}
                  </div>
                  <div v-else>
                    <v-btn small color="primary">Select</v-btn>
                  </div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>
  </v-container>

  <v-container v-model="showStudentTimeslotsTitle">
    <v-card>
      <v-card-title class="d-flex justify-center">
        Student Timeslots
      </v-card-title>
    </v-card>
  </v-container>
  <v-container v-model="showStudentTimeslots">
    <v-card>
      <v-card-title class="center">Select Timeslot for Critique</v-card-title>
      <v-card-title class="center">{{ getCurrentDate() }}</v-card-title>
    </v-card>
    <v-data-table :headers="headers" :items="timeslots" class="elevation-8">
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="handleClick(item)">
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>
  </v-container>

  <v-container
    v-if="
      showingCritiqueForm &&
      showingExpandedForm == true &&
      popupTrigger == false
    "
  >
    <v-container>
      <v-card>
        <v-card-title
          v-if="
            showingCritiqueForm &&
            showingExpandedForm == true &&
            popupTrigger == false
          "
          class="d-flex justify-center"
        >
          Expanded Critique Form
        </v-card-title>
      </v-card>
    </v-container>

    <v-container>
      <v-card>
        <v-card-title class="center">Create Event Critique</v-card-title>
        <div class="d-flex justify-center">
          <v-btn variant="outlined" @click="showingExpandedForm = false"
            >Select Quick Form</v-btn
          >
        </div>
        <br />
      </v-card>
    </v-container>

    <v-container>
      <v-card>
        <v-form>
          <v-text-field
            clearable
            label="Deportment (poise, entrance/exit, bow)"
            v-model="deportmentComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Deportment Grade"
            v-model="deportmentGrade"
            required
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
          ></v-select>

          <v-text-field
            clearable
            label="Tone (beauty, control/clarity, vibrato, warmth)"
            v-model="toneComment"
            required
          >
          </v-text-field>

          <v-select
            clearable
            label="Tone Grade"
            v-model="toneGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Accuracy/Intonation (correct notes with correct rhythm, tuning
        with keyboard and/or ensemble)"
            v-model="accuracy_intonationComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Accuracy/Intonation Grade"
            v-model="accuracy_intonationGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Technique (attacks, releases, flexibility, range, resonance, placement, support, agility)"
            v-model="techniqueComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Technique Grade"
            v-model="techniqueGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Interpretation & Musicianship (phrasing, tempo, dynamics
        communication, rapport)"
            v-model="interpretation_musicianshipComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Interpretation & Musicianship Grade"
            v-model="interpretation_musicianshipGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Balance & Blend (with accompanist or within ensemble)"
            v-model="balance_blendComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Balance & Blend Grade"
            v-model="balance_blendGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Diction/Articulation(vocal/instrumental)"
            v-model="diction_articulationComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Diction/Articulation Grade"
            v-model="diction_articulationGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Performance & Suggestions (overall readiness to
        perform)"
            v-model="overallPerformanceComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Overall Performance Grade"
            v-model="overallPerformanceGrade"
            :items="['A', 'B', 'C', 'D', 'F', '']"
            required
          ></v-select>

          <div>
            <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
          </div>

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
      </v-card>
    </v-container>
  </v-container>

  <v-container
    v-else-if="
      showingCritiqueForm &&
      showingExpandedForm == false &&
      popupTrigger == false
    "
  >
    <v-container>
      <v-card>
        <v-card-title
          v-if="
            showingCritiqueForm &&
            showingExpandedForm == false &&
            popupTrigger == false
          "
          class="d-flex justify-center"
        >
          Quick Critique Form
        </v-card-title>
      </v-card>
    </v-container>
    <v-container>
      <v-card>
        <v-card-title class="center">Create Event Critique</v-card-title>

        <div class="d-flex justify-center">
          <v-btn
            variant="outlined"
            style="margin-left: 50%; margin-right: 50%"
            @click="showingExpandedForm = true"
            >Select Expanded Form</v-btn
          >
        </div>
        <br />
      </v-card>
    </v-container>

    <v-container>
      <v-card>
        <v-form>
          <v-select
            clearable
            label="Deportment Grade"
            v-model="deportmentGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-select
            clearable
            label="Tone Grade"
            v-model="toneGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-select
            clearable
            label="Accuracy/Intonation Grade"
            v-model="accuracy_intonationGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-select
            clearable
            label="Technique Grade"
            v-model="techniqueGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-select
            clearable
            label="Interpretation & Musicianship Grade"
            v-model="interpretation_musicianshipGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-select
            clearable
            label="Balance & Blend Grade"
            v-model="balance_blendGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-select
            clearable
            label="Diction/Articulation Grade"
            v-model="diction_articulationGrade"
            :items="['Excellent', 'Good', 'Fair', 'Poor', '']"
            required
          ></v-select>

          <v-text-field
            clearable
            label="Performance & Suggestions (overall readiness to
        perform)"
            v-model="overallPerformanceComment"
            required
          ></v-text-field>

          <v-select
            clearable
            label="Overall Performance Grade"
            v-model="overallPerformanceGrade"
            :items="['A', 'B', 'C', 'D', 'F', '']"
            required
          ></v-select>

          <br />
          <div>
            <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
          </div>
          <v-btn
            variant="outlined"
            style="margin-left: 25%; margin-right: 25%; margin-bottom: 20px"
            @click="saveQuickCritique()"
            >Save</v-btn
          >
          <v-btn
            style="margin-bottom: 20px; margin-left: 12.5%"
            variant="outlined"
            @click="cancelClick()"
            >Cancel</v-btn
          >
        </v-form>
      </v-card>
    </v-container>
  </v-container>

  <v-dialog v-model="popupTrigger">
    <v-card>
      <v-card-text class="center" style="padding-top: 25%">
        Critique created successfully!
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import EventDataService from "../../services/EventDataService";
import CritiqueDataService from "../../services/CritiqueDataService";
import UserRoleDataService from "../../services/UserRoleDataService";
import JurorTimeslotDataService from "../../services/JurorTimeslotDataService";
import SemesterDataService from "../../services/SemesterDataService";
import Utils from "../../config/utils.js";
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
    errorMessage: "",

    selectingEventTitle: true,
    selectingEvent: true,
    selectingEventSemester: true,

    filteredEvents: [],
    semesters: [],
    selectCurrentSemester: [],
    selectedSemester: null,
    showStudentTimeslots: false,
    showStudentTimeslotsTitle: false,

    selectingEventHeaders: [
      { title: "Event Type", key: "type" },
      { title: "Event Date", key: "date" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Select", key: "actions", sortable: false },
    ],

    headers: [
      {
        title: "Event Type",
        align: "start",
        sortable: true,
        key: "eventType",
      },
      {
        title: "Students",
        align: "start",
        sortable: true,
        key: "performingStudents",
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
        title: "Select",
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

    clearFields() {
      this.deportmentComment = "";
      this.deportmentGrade = "";

      this.toneComment = "";
      this.toneGrade = "";

      this.accuracy_intonationComment = "";
      this.accuracy_intonationGrade = "";

      this.techniqueComment = " ";
      this.techniqueGrade = "";

      this.interpretation_musicianshipComment = "";
      this.interpretation_musicianshipGrade = "";

      this.balance_blendComment = "";
      this.balance_blendGrade = "";

      this.diction_articulationComment = "";
      this.diction_articulationGrade = "";

      this.overallPerformanceComment = "";
      this.overallPerformanceGrade = "";

      this.errorMessage = "";
    },

    cancelClick() {
      //set all fields to blank state
      this.clearFields();
      //change form state and go back to the studentTimeslots
      this.showingCritiqueForm = false;
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

    formatTime(time) {
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },

    async semesterSearchUpdate(semester) {
      await EventDataService.getSemesterEvents(semester)
        .then((response) => {
          this.filteredEvents = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
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

    async retrieveEvents(date) {
      await EventDataService.getAll(date)
        .then((response) => {
          this.filteredEvents = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async saveQuickCritique() {
      var facultyId, jurorTimeslotId;
      console.log(this.deportmentGrade);
      console.log(this.selectedTimeslot);
      //individually sets each critique line variable JSON

      //if all req fields have data
      if (!this.validateQuickForm()) {
        return;
      }

      // get userRoleId for current user
      await UserRoleDataService.getRolesForUser(this.user.userId)
        .then((response) => {
          facultyId = response.data.find((obj) => {
            return obj.role == "faculty";
          }).id;
        })
        .catch((e) => {
          console.log(e);
        });

      // create JurorTimeslot
      let jurorTimeslotData = {
        eventTimeslotId: this.selectedTimeslot.eventTimeslotId,
        jurorId: facultyId,
      };

      await JurorTimeslotDataService.create(jurorTimeslotData)
        .then((response) => {
          jurorTimeslotId = response.data.id;
        })
        .catch((e) => {
          console.log(e);
        });

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let deportmentCritique = {
          type: "Deportment",
          grade: this.deportmentGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(deportmentCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let toneCritique = {
          type: "Tone",
          grade: this.toneGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(toneCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let accuracy_intonationCritique = {
          type: "Accuracy/Intonation",
          grade: this.accuracy_intonationGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(accuracy_intonationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let techniqueCritique = {
          type: "Technique",
          grade: this.techniqueGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(techniqueCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let interpretation_musicianshipCritique = {
          type: "Interpretation & Musicianship",
          grade: this.interpretation_musicianshipGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(interpretation_musicianshipCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let balance_blendCritique = {
          type: "Balance & Blend",
          grade: this.balance_blendGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(balance_blendCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let diction_articulationCritique = {
          type: "Diction/Articulation",
          grade: this.diction_articulationGrade,
          comment: "N/A",
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(diction_articulationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let overallPerformanceCritique = {
          type: "Overall Performance & Suggestions",
          grade: this.overallPerformanceGrade,
          comment: this.overallPerformanceComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(overallPerformanceCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      this.errorMessage = "";
      this.popupTrigger = true;
      // this.showingCritiqueForm = false;
    },

    validateQuickForm() {
      var result = true;

      if (this.deportmentGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Deportment grade";
      } else if (this.toneGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Tone grade";
      } else if (this.accuracy_intonationGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select an Accuracy/Intonation grade";
      } else if (this.techniqueGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Technique grade";
      } else if (this.interpretation_musicianshipGrade == "") {
        result = false;
        this.errorMessage =
          "Error: Please select an Interpretation & Musicianship grade";
      } else if (this.balance_blendGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select an Balance & Blend grade";
      } else if (this.diction_articulationGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Diction/Articulation grade";
      } else if (this.overallPerformanceComment == "") {
        result = false;
        this.errorMessage = "Error: Please give an Overall Performance comment";
      } else if (this.overallPerformanceGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select an Overall Performance grade";
      }

      return result;
    },

    validateExpandedForm() {
      var result = true;

      if (this.deportmentComment == "") {
        result = false;
        this.errorMessage = "Error: Please provide a Deporment comment";
      } else if (this.deportmentGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Deportment grade";
      } else if (this.toneComment == "") {
        result = false;
        this.errorMessage = "Error: Please provide a Tone comment";
      } else if (this.toneGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Tone grade";
      } else if (this.accuracy_intonationComment == "") {
        result = false;
        this.errorMessage =
          "Error: Please provide an Accuracy/Intonation comment";
      } else if (this.accuracy_intonationGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select an Accuracy/Intonation grade";
      } else if (this.techniqueComment == "") {
        result = false;
        this.errorMessage = "Error: Please provide a Technique comment";
      } else if (this.techniqueGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Technique grade";
      } else if (this.interpretation_musicianshipComment == "") {
        result = false;
        this.errorMessage =
          "Error: Please provide an Interpretation & Musicianship comment";
      } else if (this.interpretation_musicianshipGrade == "") {
        result = false;
        this.errorMessage =
          "Error: Please select an Interpretation & Musicianship grade";
      } else if (this.balance_blendComment == "") {
        result = false;
        this.errorMessage = "Error: Please provide an Balance & Blend comment";
      } else if (this.balance_blendGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select an Balance & Blend grade";
      } else if (this.diction_articulationComment == "") {
        result = false;
        this.errorMessage =
          "Error: Please provide a Diction/Articulation comment";
      } else if (this.diction_articulationGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select a Diction/Articulation grade";
      } else if (this.overallPerformanceComment == "") {
        result = false;
        this.errorMessage = "Error: Please give an Overall Performance comment";
      } else if (this.overallPerformanceGrade == "") {
        result = false;
        this.errorMessage = "Error: Please select an Overall Performance grade";
      }

      return result;
    },
    async saveExpandedCritique() {
      var facultyId, jurorTimeslotId;
      console.log(this.deportmentGrade);
      console.log(this.selectedTimeslot);

      if (!this.validateExpandedForm()) {
        return;
      }

      // get userRoleId for current user
      await UserRoleDataService.getRolesForUser(this.user.userId)
        .then((response) => {
          facultyId = response.data.find((obj) => {
            return obj.role == "faculty";
          }).id;
        })
        .catch((e) => {
          console.log(e);
        });

      // create JurorTimeslot
      let jurorTimeslotData = {
        eventTimeslotId: this.selectedTimeslot.eventTimeslotId,
        jurorId: facultyId,
      };

      await JurorTimeslotDataService.create(jurorTimeslotData)
        .then((response) => {
          jurorTimeslotId = response.data.id;
        })
        .catch((e) => {
          console.log(e);
        });

      for (let i = 0; i < this.selectedTimeslot.students.length; i++) {
        let deportmentCritique = {
          type: "Deportment",
          grade: this.deportmentGrade,
          comment: this.deportmentComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(deportmentCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let toneCritique = {
          type: "Tone",
          grade: this.toneGrade,
          comment: this.toneComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(toneCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let accuracy_intonationCritique = {
          type: "Accuracy/Intonation",
          grade: this.accuracy_intonationGrade,
          comment: this.accuracy_intonationComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(accuracy_intonationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let techniqueCritique = {
          type: "Technique",
          grade: this.techniqueGrade,
          comment: this.techniqueComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(techniqueCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let interpretation_musicianshipCritique = {
          type: "Interpretation & Musicianship",
          grade: this.interpretation_musicianshipGrade,
          comment: this.interpretation_musicianshipComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(interpretation_musicianshipCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let balance_blendCritique = {
          type: "Balance & Blend",
          grade: this.balance_blendGrade,
          comment: this.balance_blendComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(balance_blendCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let diction_articulationCritique = {
          type: "Diction/Articulation",
          grade: this.diction_articulationGrade,
          comment: this.diction_articulationComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(diction_articulationCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });

        let overallPerformanceCritique = {
          type: "Overall Performance & Suggestions",
          grade: this.overallPerformanceGrade,
          comment: this.overallPerformanceComment,
          jurorTimeslotId: jurorTimeslotId,
          studentTimeslotId:
            this.selectedTimeslot.students[i].studentTimeslotId,
        };
        await CritiqueDataService.create(overallPerformanceCritique)
          .then((response) => {
            console.log(response);
          })
          .catch((e) => {
            console.log(e);
          });
      }

      this.errorMessage = "";
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
    this.user = Utils.getStore("user");
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));

    this.currentDate = new Date();

    await this.getCurrentSemester();
    this.selectCurrentSemester = this.getCurrentSemester;
    await this.semesterSearchUpdate(this.selectedSemester.id);

    // const currentDate = "2023-03-31";
    // const currentDate = this.getComparisonDate();
    // await this.retrieveTodaysTimeslots("2023-03-31");
    // await this.retrieveTodaysTimeslots(this.getComparisonDate());
    console.log(this.user);
  },
};
</script>

<style scoped>
.center {
  text-align: center;
}
</style>
