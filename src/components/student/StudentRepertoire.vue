<template>
  <v-card>
    <v-card-title> Repertoire: </v-card-title>
  </v-card>
  <v-container>
    <v-btn color="primary" @click="displayDialog"> Add Song </v-btn>
    <v-expansion-panels class="mt-10" variant="accordion">
      <v-expansion-panel v-for="semester in semesters">
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
  <v-dialog v-model="dialog" max-width="500px">
    <v-card>
      <v-card-text>
        <v-row class="ml-5">
          <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
        </v-row>
        <v-row class="mt-4 ml-5">
          <v-col cols="6">
            <v-autocomplete
              v-model="selectedComposer"
              v-model:search="composerSearch"
              label="Composer"
              :items="displayComposers"
              return-object
              :style="{ width: '160px' }"
              :no-data-text="noDataText"
              @update:modelValue="composerUpdated()"
            ></v-autocomplete>
          </v-col>
          <v-col cols="6">
            <v-select
              class="mr-15"
              v-model="selectedSong"
              label="Pieces"
              :items="songs"
              return-object
              :style="{ width: '160px' }"
            ></v-select>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue-darken-1" variant="text" @click="closeDialog"
          >Cancel</v-btn
        >
        <v-btn color="blue-darken-1" variant="text" @click="addSong">ADD</v-btn>
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
export default {
  name: "studentRepertoireView",
  data: () => ({
    user: {},
    semesters: [],
    dialog: false,
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
          this.semesters = response.data;
          this.semesters.forEach((obj) => {
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
          console.log("retreived data", this.semesters);
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
      console.log("updated");
      // this.selectedSong = null;
      // this.songs = [];
      // await SongDataService.getByComposerId(this.selectedComposer.id)
      //   .then((response) => {
      //     this.songs = response.data;
      //   })
      //   .catch((e) => {
      //     console.log(e);
      //   });
    },
    displayDialog() {
      this.dialog = true;
    },
    addSong() {
      this.closeDialog();
    },
    closeDialog() {
      this.dialog = false;
    },
    querySelections(value) {
      this.displayComposers = this.composers.filter((composer) => {
        return composer.title.toLowerCase().indexOf(value.toLowerCase()) > -1;
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
    noDataText() {
      if (this.hasSearched) {
        return "No composers found";
      } else {
        return "Start typing to search for composers";
      }
    },
  },
  async mounted() {
    this.user = Utils.getStore("user");
    await this.fillSemesters();
    this.fillComposers();
  },
};
</script>
