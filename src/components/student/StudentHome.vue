<template>
  <v-container fluid class="bg-white">
    <!-- <v-card-text>Hello World</v-card-text>
        <v-card-form class="bg-red"></v-card-form> -->
    <v-row align="start">
      <v-col>
        <!-- <v-toolbar>
          <v-toolbar-title>Upcoming Events:</v-toolbar-title>
        </v-toolbar> -->
        <v-card>
          <v-card-title> Upcoming Events: </v-card-title>
        </v-card>
        <v-container TextAlign:centered>
          You have no current upcoming events, check back later!
        </v-container>
      </v-col>
    </v-row>
    <br />
    <br />
  </v-container>
</template>

<script>
export default {
  name: "StudentHome",
  components: {},
  data: () => ({}),
};
</script>

<style scoped></style>
