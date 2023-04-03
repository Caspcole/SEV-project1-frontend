<template>
  <v-card>
    <v-card-title> Repertoire: </v-card-title>
  </v-card>
  <v-container>
    <v-btn color="primary"> Add Song </v-btn>
    <v-expansion-panels>
      <v-expansion-panel v-for="semester in semesters">
        <v-card>
          <v-card-title> </v-card-title>
        </v-card> </v-expansion-panel
    ></v-expansion-panels>
  </v-container>
</template>
<script>
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
          console.log(this.semesters);
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
