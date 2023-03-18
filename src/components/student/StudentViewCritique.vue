<template>
  <v-row align="start">
    <v-col>
      <v-card>
        <v-card-title> Students Critiques: </v-card-title>
      </v-card>
    </v-col>
  </v-row>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="selectedSemester"
          label="Semester"
          :items="semesters"
          item-value="id"
          item-title="title"
          @update:modelValue="semesterSearchUpdate(selectedSemester)"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container fluid class="bg-white">
    <v-card>
      <div class="text-subtitle-2 mt-4 mb-2">March 21 2023</div>

      <v-expansion-panels variant="accordion">
        <v-expansion-panel
          v-for="i in 3"
          :key="i"
          title="Item"
          text=""
        ></v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </v-container>
</template>

<script>
export default {
  name: "StudentViewCritique",
  components: {},
  data: () => ({}),
};
</script>

<style scoped></style>
