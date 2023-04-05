<template>
  <div>
    <h2>Event Sign-Up</h2>
    <v-container>
      <v-row>
        <v-col>
          <h3>{{ eventOb }}</h3>
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
              v-model="selectedComposers[song.id]"
              label="Composer"
              :items="composers"
              item-value="id"
              item-title="fName"
              autocomplete="off"
              @update:modelValue="
                updateAvaliableSongs(song.id, selectedComposers[song.id])
              "
              :disabled="disabledStudentSongs[song.id]"
            >
            </v-autocomplete>
          </v-col>
          <v-col>
            <!-- Ask if the v-model should change -->
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
            :disabled="disabledStudentSongs[selectedStudentSong]"
            @click="onSave(song.id)"
            >Save Song</v-btn
          >
          <!-- Grey out the edit button if another song is being edited -->
          <v-btn
            :disabled="!disabledStudentSongs[selectedStudentSong]"
            @click="editStudentSong(song.id)"
            >Edit Song</v-btn
          >
        </v-row>
      </v-container>
      <!-- figure out how to v-model each song's translation checkbox -->
    </v-card>
    <p>{{ studentSongs }}</p>
    <p>{{ selectedComposers }}</p>
    <p>{{ selectedSongs }}</p>
    <p>{{ disabledStudentSongs }}</p>
    <p>{{ selectedStudentSong }}</p>

    <!-- make button work -->
    <v-btn @click="">Add Song From Repertoire</v-btn>
    <br />
    <br />
    <v-btn @click="addStudentSong">Add Song from All Songs</v-btn>
    <br />
    <br />
    <p>Do you have a song not listed from the Add Song button?</p>
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
// Get translations
// Get songs
// import StudentDataService from "../services/StudentDataService";
import ComposersDataService from "../../services/ComposersDataService";
import SongsDataService from "../../services/SongsDataService";

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

      studentSongs: [],
      composerSongs: [],
      selectedSongs: [],
      composers: [],
      displayedComposers: [],

      student: { instructor: "Tim Hunter", instrument: "Pianno", id: "0" },
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
      this.selectedComposers.pop();
      this.selectedSongs.pop();
      this.disabledStudentSongs.pop();
      this.numOfStudentSongs--;
    },

    editStudentSong(studentSongId) {
      // add check that no other songs are being edited
      this.disabledStudentSongs[studentSongId] = false;
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
      this.onSave();
    },

    async getComposers() {
      await ComposersDataService.getAll()
        .then((response) => {
          this.composers = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
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

    networkSave() {
      createStudentTimeSlot();

      saveToRepertoire();
    },
    createStudentTimeSlot() {
      var data = {
        eventTimeslotId: this.eventOb.eventTimes[0].eventId,
      };
    },
    saveToRepertoire() {},
  },
};
</script>
