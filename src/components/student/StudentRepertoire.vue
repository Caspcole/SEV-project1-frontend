<template>
  <v-card>
    <v-card-title> Repertoire: </v-card-title>
  </v-card>
  <v-container>
    <v-btn color="primary"> Add Song </v-btn>
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
</template>
<script>
import Utils from "../../config/utils.js";
import RepertoireDataService from "../../services/RepertoireDataService";
export default {
  name: "studentRepertoireView",
  data: () => ({
    user: {},
    semesters: [],
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
  },
  async mounted() {
    this.user = Utils.getStore("user");
    await this.fillSemesters();
  },
};
</script>
