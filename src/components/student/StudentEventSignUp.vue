<template>
  <div>
    <h2>Event Sign-Up</h2>
    <v-container>
      <v-row>
        <v-col>
          <h3>{{ eventOb.type }}</h3>
          <!-- We need to add Event names to the database -->
        </v-col>
        <v-col>
          <h3>{{ eventOb.date }}</h3>
          <h4>Time Slots:</h4>
          <h4 v-for="timeslot in eventOb.eventTimes" :key="timeslot.id">
            {{ timeslot.startTime }}
          </h4>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h4>Instructor</h4>
          <h5>{{ student.instructor }}</h5>
        </v-col>
        <v-col>
          <h4>Student Instrument</h4>
          <h5>{{ student.instrument }}</h5>
        </v-col>
      </v-row>
    </v-container>
    <h3>Songs</h3>
    <v-card v-for="song in studentSongs" :key="song.id">
      <p>Please select a composer, then a piece</p>
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
                updateAvaliableSongs(song.id, selectedComposers[song.id])
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
          <v-btn color="primary" block @click="dialog = false"
            >Close Dialog</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Add Song From Repertoire needs to be implemented -->
    <v-btn @click="">Add Song From Repertoire</v-btn>
    <br />
    <br />
    <v-btn @click="addStudentSong">Add Song from All Songs</v-btn>
    <br />
    <br />
    <p>Do you have a song not listed from the Add Song button?</p>
    <!-- This button also needs to be implemented -->
    <v-btn @click="">Register a Song</v-btn>
  </div>
  <br />
  <strong class="text-red-lighten-1">{{ this.errorMessage }}</strong>
  <br />
  <div>
    <v-btn @click="submitPage">Submit Page</v-btn>
  </div>
</template>

<script>
import ComposersDataService from "../../services/ComposersDataService";
import SongsDataService from "../../services/SongsDataService";
import StudentTimeslotDataService from "../../services/StudentTimeslotDataService";
import TimeslotSongsDataService from "../../services/TimeslotSongsDataService";
import RepertoireDataService from "../../services/RepertoireDataService";

export default {
  name: "student-event-signup",
  props: {
    eventOb: Object,
  },
  data() {
    return {
      errorMessage: "",

      numOfStudentSongs: 0,
      allSongs: [],
      searchSongs: [],
      songSearch: "",
      songLoading: false,

      selectedStudentSong: null,
      selectedComposers: [],
      disabledStudentSongs: [],
      selectedSongs: [],
      dialogPopup: false,

      studentInstrumentId: 1,
      instructorId: 1,

      studentSongs: [],
      composerSongs: [],

      user: {},
      student: { instructor: "Tim Hunter", instrument: "Piano", id: "0" }, // reaplace this when the eventOb passes in student info
      // semester info will be passed by eventOb
    };
  },
  async created() {
    await this.getComposers();
    await this.getAllSongs();
  },
  computed: {
    filteredSongs() {
      return this.items.filter((item) =>
        this.songFilter(item, this.songSearch, item.text)
      );
    },
  },
  mounted() {
    this.user = Utils.getStore("user");
  },
  methods: {
    onSave() {
      this.errorMessage = "";

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

    async getAllSongs() {
      await SongsDataService.getAll()
        .then((response) => {
          this.allSongs = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    async updateAvaliableSongs(studentSongId, composerId) {
      await SongsDataService.getByComposerId(composerId)
        .then((response) => {
          this.composerSongs[studentSongId] = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    //   return (
    //     itemText.toLowerCase().indexOf(queryText.toLowerCase()) !== -1 &&
    //     queryText.length >= 2
    //   );
    // },
    validateSongs() {
      this.studentSongs.forEach((song) => {
        // console.log(song);
        if (song.composer == "") {
          this.errorMessage = "Please do not leave a composer blank.";
        } else if (song.piece == "") {
          this.errorMessage = "Please do not leave a piece blank.";
        }
      });
    },

    async createStudentTimeSlot() {
      var studentTimeslotData = {
        eventTimeslotId: this.eventOb.eventTimes[0].eventId,
        studentInstrumentId: this.studentInstrumentId, // filler while students aren't working
        instructorId: this.instructorId,
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

          this.dialogMessage = "Time slot successfully reserved";
          this.dialogPopup = true;
        })
        .catch((e) => {
          this.message = e.response.data.message;
          this.dialogMessage =
            "There was an error with reserving your time slot\n" +
            `${this.message}`;
        });
    },

    async saveToRepertoire() {
      this.studentSongs.forEach(async (piece) => {
        const data = {
          studentInstrumentId: this.studentInstrumentId,
          songId: piece.piece,
          // semesterId:
          //   this.selectedSemester == null ? null : this.selectedSemester.id,
        };

        await RepertoireDataService.create(data).catch((e) => {
          console.log(e);
        });
      });
    },

    networkSave() {
      this.saveToRepertoire();

      this.createStudentTimeSlot();
    },
  },
};
</script>
