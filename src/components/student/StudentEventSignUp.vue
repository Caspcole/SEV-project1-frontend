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
              :filter="songFilter"
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

      <!-- <input v-model="translation.text" /> -->
    </v-card>
    <!-- make button work -->
    <v-btn @click="">Add Song From Repertoire</v-btn>
    <br />
    <br />
    <v-btn @click="addStudentSong">Add Song from All Songs</v-btn>
    <br />
    <br />
    <p>Do you have a song not listed from the Add Song button?</p>
    <v-btn @click="addStudentSong">Register a Song</v-btn>
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
      // composersPage: 1,
      // selectedComposers: [],
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
      if (this.selectedComposers[this.selectedStudentSong]) {
        if (this.selectedSongs[this.selectedStudentSong]) {
          this.studentSongs[this.selectedStudentSong].composer =
            this.selectedComposers[this.selectedStudentSong];
          console.log(this.selectedComposers[this.selectedStudentSong].id);
          this.studentSongs[this.selectedStudentSong].piece =
            this.selectedSongs[this.selectedStudentSong];

          this.disabledStudentSongs[this.selectedStudentSong] = true;
        } else {
          this.errorMessage = "Please select a piece.";
        }
      } else {
        this.errorMessage = "Please select a composer.";
      }
    },

    deleteStudentSong(songId) {
      console.log(this.studentSongs);

      console.log(this.studentSongs.length - 2);
      for (let i = songId; i < this.studentSongs.length - 2; i++) {
        this.studentSongs[i] = this.studentSongs[i + 1];
        this.studentSongs[i].id = i;
      }
      this.studentSongs = this.studentSongs.splice(0, -1);
    },

    editStudentSong(studentSongId) {
      // add check that no other songs are being edited
      this.disabledStudentSongs[studentSongId] = false;
    },
    // async requiresTranslation(songId) {
    //   // await SongTranslationsDataService.getBySongId(parseInt(songId))
    //   await SongTranslationsDataService.getBySongId(parseInt("1"))
    //     .then((response) => {
    //       console.log(response.data);
    //       if (response.data != []) {
    //         return "true";
    //       } else {
    //         return "false";
    //       }
    //       // this.student = response.data;
    //       // console.log(this.student);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // },
    addStudentSong() {
      if (this.studentSongs.length > 0) {
        this.onSave();
      }

      this.selectedStudentSong = this.numOfStudentSongs;

      this.studentSongs.push({
        piece: "",
        composer: "",
        id: this.numOfStudentSongs,
      });

      this.disabledStudentSongs.push(false);
      this.numOfStudentSongs++;
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

    // songFilter(item, queryText, itemText) {
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
  },
  // watch: {
  //   // want deep watchers for this
  //   songItems() {
  //     this.selectedItem = null;
  //   },
  // },
  // mounted() {},
};
</script>
