<template>
  <v-container fluid class="bg-cream">
    <h3 class="center">Select Timeslot for Critique</h3>
    <br />
    <h3 class="center">{{ getCurrentDate() }}</h3>
    <v-data-table
      v-model:itemsPerPage="TimeslotsPerPage"
      :headers="headers"
      :items="timeslots"
      item-value="name"
      class="elevation-8"
    >
    </v-data-table>
  </v-container>

  <!-- <v-container fluid class="bg-cream"> -->
  <!-- This was lazy but it works, center later with a .css file -->
  <!-- <h2><center>Create Event Critique</center></h2> -->
  <!-- Probably better to have a grid here too -->
  <!-- <br /><br />
    <v-grid>
      <v-btn variant="outlined">Jury</v-btn>
      <v-btn variant="outlined">Recital</v-btn>
      <v-btn variant="outlined">Capstone</v-btn>
      <v-btn variant="outlined">Scholarship</v-btn>
    </v-grid>
  </v-container> -->

  <!-- <v-container fluid class="bg-cream" > -->
  <!-- <v-container fluid class="fill-height bg-white"> -->
  <!-- <v-form> -->
  <!-- Do more research on DOM stuff, scripts, and templates. -->
  <!-- grid would be better practice. Add button at end of form later to dynamically fill other fields based on Jury/Recital/Capstone -->
  <!-- When something goes off the page, Vue allows for scrolling by default. Can abuse this to load multiple components at a time -->
  <!-- <v-label for="deportment">
        <b>Deportment</b>(poise, entrance/exit, bow)</v-label
      ><br />
      <span class="border"
        ><input type="text" id="deportment" name="deportmentComment" value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="tone">
        <b>Tone</b>(beauty, control/clarity, vibrato, warmth)</v-label
      ><br />
      <span class="border"
        ><input type="text" id="tone" name="toneComment" value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="accuracy_intonation">
        <b>Accuracy/Intonation</b>(correct notes with correct rhythm, tuning
        with keyboard and/or ensemble)</v-label
      ><br />
      <span class="border"
        ><input
          type="text"
          id="accuracy_intonation"
          name="accuracy_intonationComment"
          value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="technique">
        <b>Technique</b>(correct notes with correct rhythm, tuning with keyboard
        and/or ensemble)</v-label
      ><br />
      <span class="border"
        ><input type="text" id="technique" name="techniqueComment" value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="interpretation_musicianship">
        <b>Interpretation, Musicianship</b>(phrasing, tempo, dynamics
        communication, rapport)</v-label
      ><br />
      <span class="border"
        ><input type="text" id="technique" name="techniqueComment" value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="balance_blend">
        <b>Balance Blend</b>(with accompanist or within ensemble)</v-label
      ><br />
      <span class="border"
        ><input
          type="text"
          id="balance_blend"
          name="balance_blendComment"
          value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="diction">
        <b>Diction/Articulation (vocal/instrumental)</b>(vowels; constanants,
        legato, double/triple tongue)</v-label
      ><br />
      <span class="border"
        ><input type="text" id="diction" name="dictionComment" value=""
      /></span>
      <v-select
        label="Select"
        :items="['Poor', 'Fair', 'Good', 'Exellent', '']"
      ></v-select>

      <v-label for="performance">
        <b>Performance and Suggestions</b>(overall readiness to
        perform)</v-label
      ><br />
      <span class="border"
        ><input type="text" id="technique" name="techniqueComment" value=""
      /></span>
      <br />
      <br /><br /><br />
      <v-btn variant="outlined">Save</v-btn
      ><v-btn variant="outlined">Cancel</v-btn>
    </v-form>
  </v-container> -->

  <!-- <v-data-table>
    
  </v-data-table> -->
</template>

<script>
// HAS CAUSED ME BUGS
// import { start } from "repl";
import TimeslotDataService from "../services/TimeslotDataService";

export default {
  name: "CreateCritique",
  components: {},
  data: () => ({
    itemsPerPage: 10,
    headers: [
      {
        title: "Student",
        align: "start",
        sortable: false,
        key: "student",
      },
      {
        title: "Instrument",
        align: "start",
        sortable: false,
        key: "instrument",
      },
    ],
  }),
  methods: {
    async retrieveTodaysTimeslots() {
      await TimeslotDataService.getAll()
        .then((response) => {
          this.eventTimeslots = response.data;
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

    getComparisonDate() {
      const today = new Date();
      const day = String(today.getDate()).padStart(2, "0");
      const month = String(today.getMonth() + 1).padStart(2, "0");
      const year = today.getFullYear();
      return `${year}-${month}-${day}`;
    },
  },
};
</script>

<!-- <style scoped> -->
<style scoped>
.center {
  text-align: center;
}
</style>
