<template>
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
