<template>
  <v-card>
    <v-card-title> Event Availability: </v-card-title>
  </v-card>
</template>
<script>
export default {
  name: "studentRepertoireView",
  data: () => ({
    user: {},
  }),
  methods: {},
  async mounted() {
    this.user = Utils.getStore("user");
  },
};
</script>
