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
              return-object
              @update:modelValue="
                updateAvaliableSongs(song.id, selectedComposers[song.id].id)
              "
            >
              <template v-slot:append-item>
                <div v-intersect="onIntersect" class="pa-4 teal--text">
                  Loading more items ...
                </div>
              </template>
            </v-autocomplete>
            <p>{{ studentSongs }}</p>
          </v-col>
          <v-col>
            <v-combobox
              clearable
              v-model="songs[selectedComposers[song.id]]"
              label="Song"
              :items="songs"
              item-value="id"
              item-title="title"
            >
            </v-combobox>
          </v-col>
          <v-col>
            <!-- <v-checkbox
              label="translation required"
              :model-value="requiresTranslation(song.id)"
            ></v-checkbox> -->
          </v-col>
        </v-row>
      </v-container>
      <!-- figure out how to v-model each song's translation checkbox -->

      <!-- <input v-model="translation.text" /> -->
    </v-card>
    <!-- make button work -->
    <v-btn @click="">Add Song From Repertoir</v-btn>
    <br />
    <v-btn @click="addStudentSong">Add New Song</v-btn>
  </div>
</template>

<script>
// Get translations
// Get songs
// import StudentDataService from "../services/StudentDataService";
import ComposersDataService from "../services/ComposersDataService";
import SongsDataService from "../services/SongsDataService";

export default {
  name: "student-event-signup",
  props: {
    eventOb: Object,
  },
  data() {
    return {
      // songs: [
      //   { title: "song1", composer: "mossypaint", id: 1 },
      //   { title: "song2", composer: "troubleshoot", id: 2 },
      // ],
      numOfStudentSongs: 0,
      studentSongs: [],
      songs: [],
      selectedSongs: [],
      composers: [],
      displayedComposers: [],
      composersPage: 1,
      selectedComposers: [],
      dialog: false,
      studentId: "0",
      student: { instructor: "Tim", instrument: "Voice" },
    };
  },
  async created() {
    await this.getComposers();
    this.addStudentSong();
  },
  methods: {
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
      this.studentSongs.push({
        title: "",
        composer: "",
        id: this.numOfStudentSongs,
      });
      this.numOfStudentSongs++;
    },
    async getComposers() {
      await ComposersDataService.getAll()
        .then((response) => {
          this.composers = response.data;
          this.displayedComposers(this.composersPage);
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.composers);
    },
    displayedComposers(cutoffNum) {},

    async updateAvaliableSongs(studentSongId, composerId) {
      await SongsDataService.getByComposerId(composerId)
        .then((response) => {
          // this.songs.eval("composerId" + composerId + "= response.data;");
          this.songs[composerId] = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
      console.log(this.songs[composerId][0]);
      this.studentSongs[studentSongId].composer = composerId.toString();
    },
    onIntersect() {
      console.log("load more...");
      this.composersPage += 1;
      // this.getBeers();
    },
    // async retrieveStudentData() {
    //   await StudentDataService.get(parseInt(this.studentId))
    //     .then((response) => {
    //       this.student = response.data;
    //       console.log(this.student);
    //     })
    //     .catch((e) => {
    //       console.log(e);
    //     });
    // },
  },
  // mounted() {},
};
</script>
