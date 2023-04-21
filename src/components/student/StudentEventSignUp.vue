<template>
  <div class="ma-5">
    <v-card class="pa-2 ma-2">
      <v-card>
        <v-card-title class="d-flex justify-center">Event Sign-Up</v-card-title>
      </v-card>
      <v-container>
        <v-row>
          <v-col>
            <h3>{{ eventOb.type }} on {{ eventOb.date }}</h3>
          </v-col>
          <v-col>
            <h3></h3>
            <h4>Time Slots:</h4>
            <h4 v-for="timeslot in eventOb.eventTimes" :key="timeslot.id">
              {{ timeslot.startTime }}
            </h4>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Instructor</h4>
            <h5>
              {{ displayedInstructor() }}
            </h5>
          </v-col>
          <v-col>
            <h4>Student Instrument</h4>
            <h5>{{ displayedInstrument() }}</h5>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <h4>Accompanist</h4>
            <h5>{{ displayedAccompanist() }}</h5>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
    <v-card class="pa-2 ma-2">
      <h3>Songs</h3>
      <v-card v-for="song in studentSongs" :key="song.id">
        <p class="ma-2">Please select a composer, then a piece</p>
        <v-container>
          <v-row>
            <v-col>
              <v-autocomplete
                clearable
                v-model="selectedComposers[song.id]"
                label="Composer"
                :items="composers"
                item-value="id"
                item-title="fullName"
                autocomplete="off"
                @update:modelValue="
                  updateAvailableSongs(song.id, selectedComposers[song.id])
                "
                :disabled="disabledStudentSongs[song.id]"
              >
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-autocomplete
                clearable
                v-model="selectedSongs[song.id]"
                label="Piece"
                :items="
                  selectedComposers[song.id]
                    ? composerSongs[song.id]
                    : searchSongs
                "
                item-value="id"
                item-title="title"
                :disabled="disabledStudentSongs[song.id]"
              >
              </v-autocomplete>
            </v-col>
            <v-col>
              <v-btn @click="deleteStudentSong(song.id)">Delete</v-btn>
            </v-col>
          </v-row>
          <v-row>
            <!-- Grey ou the save button if another song is being edited -->
            <v-btn
              :disabled="disabledStudentSongs[song.id]"
              @click="onSave(song.id)"
              >Save Song</v-btn
            >
            <!-- Grey out the edit button if another song is being edited -->
            <v-btn
              :disabled="!disabledStudentSongs[song.id]"
              @click="editStudentSong(song.id)"
              >Edit Song</v-btn
            >
          </v-row>
        </v-container>
      </v-card>

      <v-dialog v-model="dialogPopup" width="auto">
        <v-card>
          <v-card-text> "{{ dialogMessage }}" </v-card-text>
          <v-card-actions>
            <v-btn color="primary" block @click="closeDialog"
              >Close Dialog</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Add Song From Repertoire needs to be implemented -->
      <!-- <v-btn class="ma-2" @click="">Add Song From Repertoire</v-btn> -->
      <br />
      <v-btn @click="addStudentSong">Add Song from All Songs</v-btn>
      <br />
      <br />
      <p>Do you have a song not listed from the Add Song button?</p>
      <!-- This button also needs to be implemented -->
      <v-btn @click="">Register a Song</v-btn>
      <br />
      <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
      <br />
      <div>
        <v-btn @click.once="submitPage">Submit Page</v-btn>
      </div>
    </v-card>
  </div>
</template>

<script>
import Utils from "../../config/utils.js";
import ComposersDataService from "../../services/ComposersDataService";
import SongsDataService from "../../services/SongsDataService";
import StudentTimeslotDataService from "../../services/StudentTimeslotDataService";
import TimeslotSongsDataService from "../../services/TimeslotSongsDataService";
import RepertoireDataService from "../../services/RepertoireDataService";
import SemesterDataService from "../../services/SemesterDataService";

export default {
  name: "student-event-signup",
  props: {
    eventOb: Object,
  },
  data() {
    return {
      errorMessage: "",

      numOfStudentSongs: 0,
      // allSongs: [],
      searchSongs: [],
      songSearch: "",
      songLoading: false,

      selectedStudentSong: null,
      selectedComposers: [],
      disabledStudentSongs: [],
      selectedSongs: [],
      dialogPopup: false,

      // studentInstrumentId: 0, // this will be passed in from eventOb
      // instructorId: 0, // this will be passed in from eventOb
      // instructor: null,
      // accompanist: null,
      currentSemesterId: 0,

      studentSongs: [],
      composerSongs: [],

      studentRepertoire: [],

      user: {},
      student: {
        instructor: "Tim Hunter",
        instrument: "Piano",
        accompanist: "Jeffery Beysos",
        id: "0",
      }, // reaplace this when the eventOb passes in student info
    };
  },
  emits: ["navToStudentViewEvents"],
  setup(props, { emit }) {
    const navToStudentViewEvents = () => {
      emit("navToStudentViewEvents");
    };
    return {
      navToStudentViewEvents,
    };
  },
  computed: {
    filteredSongs() {
      return this.items.filter((item) =>
        this.songFilter(item, this.songSearch, item.text)
      );
    },
  },
  async created() {
    this.user = Utils.getStore("user");

    if (!this.eventOb.hasOwnProperty("studentInstrument")) {
      this.dialogMessage = "There was an error when reserving your time slot.";
      this.dialogPopup = true;
    }

    await this.getComposers();

    await this.calculateSemester();
  },
  methods: {
    onSave() {
      this.errorMessage = "";

      if (this.studentSongs.length == 0) {
        this.errorMessage = "Please add a song in order to submit.";
        return false;
      } else {
        if (!this.disabledStudentSongs[this.selectedStudentSong]) {
          if (this.selectedComposers[this.selectedStudentSong]) {
            if (this.selectedSongs[this.selectedStudentSong]) {
              this.studentSongs[this.selectedStudentSong].composer =
                this.selectedComposers[this.selectedStudentSong];
              this.studentSongs[this.selectedStudentSong].piece =
                this.selectedSongs[this.selectedStudentSong];

              this.disabledStudentSongs[this.selectedStudentSong] = true;
              return true;
            } else {
              this.errorMessage = "Please select a piece.";
              return false;
            }
          } else {
            this.errorMessage = "Please select a composer.";
            return false;
          }
        } else {
          return true;
        }
      }
    },

    displayedAccompanist() {
      let returnString = "You have no accompanist.";

      if (this.eventOb.hasOwnProperty("studentInstrument")) {
        if (this.eventOb.studentInstrument.hasOwnProperty("accompanist")) {
          if (this.eventOb.studentInstrument.accompanist) {
            return (
              this.eventOb.studentInstrument.accompanist.user.fName +
              " " +
              this.eventOb.studentInstrument.accompanist.user.lName
            );
          }
        }
      }
      return returnString;
    },

    displayedInstructor() {
      let returnString = "You have no instructor.";
      if (this.eventOb.hasOwnProperty("studentInstrument")) {
        if (this.eventOb.studentInstrument.hasOwnProperty("instructor")) {
          if (this.eventOb.studentInstrument.instructor) {
            return (
              this.eventOb.studentInstrument.instructor.user.fName +
              " " +
              this.eventOb.studentInstrument.instructor.user.lName
            );
          }
        }
      }
      return returnString;
    },

    displayedInstrument() {
      if (this.eventOb.hasOwnProperty("studentInstrument")) {
        return this.eventOb.studentInstrument.instrument.name;
      } else {
        this.errorDialog();
        return "No instrument.";
      }
    },

    deleteStudentSong(songId) {
      for (let i = songId; i < this.studentSongs.length - 1; i++) {
        this.studentSongs[i] = this.studentSongs[i + 1];
        this.studentSongs[i].id = i;

        this.selectedComposers[i] = this.selectedComposers[i + 1];

        this.selectedSongs[i] = this.selectedSongs[i + 1];

        this.disabledStudentSongs[i] = this.disabledStudentSongs[i + 1];
      }
      if (this.selectedStudentSong - 1 >= 0) {
        this.selectedStudentSong--;
      }

      this.studentSongs.pop();
      if (!this.disabledStudentSongs[this.selectedStudentSong]) {
        this.selectedComposers.pop();
        this.selectedSongs.pop();
      }

      this.disabledStudentSongs.pop();
      this.numOfStudentSongs--;
    },

    editStudentSong(studentSongId) {
      // add check that no other songs are being edited
      var countDisabledSongs = 0;
      for (let i = 0; i < this.disabledStudentSongs.length; i++) {
        if (!this.disabledStudentSongs[i]) {
          countDisabledSongs++;
        }
      }

      if (countDisabledSongs == 0) {
        this.disabledStudentSongs[studentSongId] = false;
        this.selectedStudentSong = studentSongId;
      } else {
        this.errorMessage =
          "Please save the song you are editing before editing another.";
      }
    },

    addStudentSong() {
      let validSave = false;
      if (this.studentSongs.length > 0) {
        validSave = this.onSave();
      } else {
        validSave = true;
      }

      if (validSave) {
        this.selectedStudentSong = this.numOfStudentSongs;

        this.studentSongs.push({
          piece: "",
          composer: "",
          id: this.numOfStudentSongs,
        });

        this.disabledStudentSongs.push(false);
        this.numOfStudentSongs++;
      }
    },

    submitPage() {
      var isSaved = this.onSave();

      if (isSaved) {
        this.networkSave();
      }
    },

    async getComposers() {
      await ComposersDataService.getAll()
        .then((response) => {
          this.composers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
      for (let i = 0; i < this.composers.length; i++) {
        this.composers[
          i
        ].fullName = `${this.composers[i].fName} ${this.composers[i].lName}`;
      }
    },

    async updateAvailableSongs(studentSongId, composerId) {
      await SongsDataService.getByComposerId(composerId)
        .then((response) => {
          this.composerSongs[studentSongId] = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    validateSongs() {
      if (this.studentSongs.length == 0) {
        this.errorMessage = "Please add a song in order to submit.";
      } else {
        this.studentSongs.forEach((song) => {
          if (song.composer == "") {
            this.errorMessage = "Please do not leave a composer blank.";
          } else if (song.piece == "") {
            this.errorMessage = "Please do not leave a piece blank.";
          }
        });
      }
    },

    async createStudentTimeSlot() {
      // save every eventTimeslot selected
      for (var i = 0; i < this.eventOb.eventTimes.length; i++) {
        var studentTimeslotData = {
          eventTimeslotId: this.eventOb.eventTimes[i].id,
          studentInstrumentId: this.eventOb.studentInstrument.id, // filler while students aren't working
          instructorId: this.eventOb.studentInstrument.instructor.id,
        };

        await StudentTimeslotDataService.create(studentTimeslotData)
          .then((response) => {
            var createdStudentTimeslotId = response.data.id;

            this.studentSongs.forEach(async (piece) => {
              var timeslotSongData = {
                timeslotId: createdStudentTimeslotId,
                songId: piece.piece,
              };

              await TimeslotSongsDataService.create(timeslotSongData)
                .then((response) => {})
                .catch((e) => {
                  this.message = e.response.data.message;
                });
            });
          })
          .catch((e) => {
            this.message = e.response.data.message;
            this.errorMessage =
              "There was an error with reserving your time slot\n" +
              `${this.message}`;
          });
      }
    },

    async saveToRepertoire() {
      await this.getStudentRepertoire();

      this.studentSongs.forEach(async (piece) => {
        let isInRepertoire = false;
        if (this.studentRepertoire.length > 0) {
          for (
            let i = 0;
            i < this.studentRepertoire.length && !isInRepertoire;
            i++
          ) {
            if (this.studentRepertoire[i].songId == piece.piece) {
              isInRepertoire = true;
            }
          }
          if (!isInRepertoire) {
            const data = {
              studentInstrumentId: this.eventOb.studentInstrument.id,
              songId: piece.piece,
              semesterId: this.currentSemesterId,
            };

            await RepertoireDataService.create(data).catch((e) => {
              console.log(e);
              this.errorMessage =
                "There was an error reserving your time slot.";
            });
          }
        } else {
          const data = {
            studentInstrumentId: this.eventOb.studentInstrument.id,
            songId: piece.piece,
            semesterId: this.currentSemesterId,
          };

          await RepertoireDataService.create(data).catch((e) => {
            console.log(e);
            this.errorMessage = "There was an error reserving your time slot.";
          });
        }
      });
    },

    async getStudentRepertoire() {
      await RepertoireDataService.getByUser(this.user.userId)
        .then((response) => {
          this.studentRepertoire = response.data;
        })
        .catch((e) => {
          this.message = e.response.data.message;
          this.errorMessage =
            "There was an error with reserving your time slot\n" +
            `${this.message}`;
        });
    },

    async networkSave() {
      await this.saveToRepertoire();

      await this.createStudentTimeSlot();

      if (this.errorMessage == "") {
        this.dialogMessage = "Sucessfully reserved your time slot.";
        this.dialogPopup = true;
      }
    },

    async calculateSemester() {
      await SemesterDataService.getCurrent(this.eventOb.date)
        .then((response) => {
          this.currentSemesterId = response.data[0].id;
        })
        .catch((e) => {
          console.log(e);
          this.dialogMessage =
            "There was an error when reserving your time slot. Please ask an administrator to check the event.";
          this.dialogPopup = true;
        });
    },

    errorDialog() {
      this.dialogMessage = "There was an error when reserving your time slot.";
      this.dialogPopup = true;
    },

    closeDialog() {
      this.$emit("navToStudentViewEvents");
    },
  },
};
</script>
