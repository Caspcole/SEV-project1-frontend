<template>
  <v-card>
    <v-card-title> Repertoire: </v-card-title>
  </v-card>
  <v-container>
    <v-btn color="primary" @click="displayDialog"> Add Piece </v-btn>
    <v-expansion-panels class="mt-10" variant="accordion">
      <v-expansion-panel v-for="semester in userSemesters">
        <v-expansion-panel-title>
          {{ "  " + semester.semesterTitle }}
        </v-expansion-panel-title>
        <v-expansion-panel-text>
          <v-card
            v-for="stuInstrument in semester.studentInstruments"
            class="mt-5"
            elevation="2"
          >
            <v-card-title>
              {{ stuInstrument.instrument.name }}
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col v-for="song in stuInstrument.repertoire" cols="6">
                  <v-card elevation="2">
                    <v-card-text justify="center" class="pa-1 ma-1">
                      <strong>
                        {{ song.title }}
                      </strong>
                      <div>
                        {{
                          "By: " +
                          song.composer.fName +
                          " " +
                          song.composer.lName
                        }}
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
  <v-dialog v-model="dialog" max-width="700px">
    <v-card>
      <v-card-title> Add a piece to your repertoire </v-card-title>
      <v-card-text>
        <v-row class="ml-5">
          <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        </v-row>
        <v-row class="mt-4 ml-5"> Select your instrument and semester </v-row>
        <v-row><v-divider></v-divider></v-row>
        <v-row class="mt-4 ml-5">
          <v-col cols="6">
            <v-select
              clearable
              v-model="selectedStudentInstrument"
              label="Instrument"
              :items="studentInstruments"
              item-title="instrument.name"
              return-object
              :style="{ width: '250px' }"
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-select
              clearable
              v-model="selectedSemester"
              label="Semester (optional)"
              :items="semesters"
              item-value="id"
              item-title="title"
              :style="{ width: '250px' }"
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="mt-4 ml-5"> Select the piece </v-row>
        <v-row><v-divider></v-divider></v-row>
        <v-row class="mt-4 ml-5">
          <v-col cols="6">
            <v-autocomplete
              clearable
              v-model="selectedComposer"
              v-model:search="composerSearch"
              label="Composer"
              :items="displayComposers"
              return-object
              :style="{ width: '250px' }"
              :no-data-text="noComposerDataText"
              @update:modelValue="composerUpdated()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-autocomplete
              clearable
              class="mr-15"
              v-model="selectedSong"
              label="Pieces"
              :items="songs"
              return-object
              :no-data-text="noPieceDataText"
              :style="{ width: '250px' }"
            ></v-autocomplete>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog"
          >Cancel</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="addPiece"
          >ADD</v-btn
        >
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script>
import Utils from "../../config/utils.js";
import RepertoireDataService from "../../services/RepertoireDataService";
import ComposerDataService from "../../services/ComposerDataService";
import SongDataService from "../../services/SongDataService";
import SemesterDataService from "../../services/SemesterDataService";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
export default {
  name: "studentRepertoireView",
  data: () => ({
    user: {},
    userSemesters: [],
    dialog: false,
    studentInstruments: [],
    selectedStudentInstrument: null,
    semesters: [],
    selectedSemester: null,
    composers: [],
    displayComposers: [],
    selectedComposer: null,
    composerSearch: null,
    hasSearched: false,
    songs: [],
    selectedSong: null,
    errorMessage: "",
  }),
  methods: {
    async fillSemesters() {
      RepertoireDataService.getByUser(this.user.userId)
        .then((response) => {
          this.userSemesters = response.data;
          this.userSemesters.forEach((obj) => {
            if (obj.id == null) {
              obj.semesterTitle = "Additional Repertoire";
            } else {
              obj.semesterTitle = obj.year + " - " + obj.code;
            }

            obj.studentInstruments = [];
            obj.repertoires.forEach((rep) => {
              var index = obj.studentInstruments.findIndex(
                (obj2) => obj2.id === rep.studentInstrument.id
              );

              if (index == -1) {
                obj.studentInstruments.push(rep.studentInstrument);
                index = obj.studentInstruments.length - 1;
                obj.studentInstruments[index].repertoire = [];
              }

              obj.studentInstruments[index].repertoire.push(rep.song);
            });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    fillComposers() {
      ComposerDataService.getAll()
        .then((response) => {
          this.composers = response.data;
          this.composers.forEach((composer) => {
            composer.title = composer.fName + " " + composer.lName;
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async composerUpdated() {
      this.selectedSong = null;
      this.songs = [];
      if (this.selectedComposer != null) {
        await SongDataService.getByComposerId(this.selectedComposer.id)
          .then((response) => {
            this.songs = response.data;
          })
          .catch((e) => {
            console.log(e);
          });
      }
    },
    displayDialog() {
      this.errorMessage = "";
      this.dialog = true;
    },
    async addPiece() {
      if (!this.isValid()) {
        return;
      }

      const data = {
        studentInstrumentId: this.selectedStudentInstrument.id,
        songId: this.selectedSong.id,
        semesterId: this.selectedSemester,
      };

      await RepertoireDataService.create(data).catch((e) => {
        console.log(e);
      });

      this.fillSemesters();
      this.selectedStudentInstrument = null;
      this.selectedSemester = null;
      this.selectedComposer = null;
      this.selectedSong = null;

      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
    },
    isValid() {
      var result = true;

      if (this.selectedStudentInstrument == null) {
        this.errorMessage = "Please select your instrument";
        result = false;
      } else if (this.selectedComposer == null) {
        this.errorMessage = "Please select a composer";
        result = false;
      } else if (this.selectedSong == null) {
        this.errorMessage = "Please select a piece";
        result = false;
      }

      return result;
    },
    querySelections(value) {
      this.displayComposers = this.composers.filter((composer) => {
        return composer.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
      });
    },
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
          this.semesters.forEach(
            (obj) => (obj.title = obj.year + " - " + obj.code)
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async retrieveStudentInstruments() {
      await StudentInstrumentDataService.getByUser(this.user.userId)
        .then((response) => {
          this.studentInstruments = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  watch: {
    composerSearch(val) {
      if (val && val.length > 1) {
        this.hasSearched = true;
        this.querySelections(val);
      } else {
        this.hasSearched = false;
        this.displayComposers = [];
      }
    },
  },
  computed: {
    noComposerDataText() {
      if (this.hasSearched) {
        return "No composers found";
      } else {
        return "Start typing to search for composers";
      }
    },
    noPieceDataText() {
      if (this.selectedComposer != null) {
        return "No songs currently for this composer";
      } else {
        return "No composer selected";
      }
    },
  },
  async mounted() {
    this.user = Utils.getStore("user");
    await this.fillSemesters();
    this.fillComposers();
    this.retrieveAllSemesters();
    this.retrieveStudentInstruments();
  },
};
</script>
