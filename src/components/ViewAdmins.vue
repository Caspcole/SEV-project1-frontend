<template>
  <div>
    <v-container fluid class>
      <v-row>
        <v-col>
          <v-card-text>
            <h3>View Admins</h3>
            <br />
            <v-card height="500" width="300" class="scrollable">
              <v-btn
                v-for="event in events"
                :key="event.id"
                v-on:click="changeCurrentEvent(event)"
                variant="tonal"
                v-bind:color="event.id === currentEvent.id ? 'blue' : 'black'"
              >
                {{ event.type + " - " + event.date }}
              </v-btn>
            </v-card>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  name: "ViewAdmins",
  components: {},
  data: () => ({
    dialog: false,
    search: "",
    admins: [],
    currentAdmin: {},
  }),
  methods: {
    changeCurrentAdmin(admin) {
      this.currentAdmin = admin;
      this.determineEventTimes();
      // console.log(this.currentEvent.id);
    },
    async retrieveAdmins() {
      await AdminDataService.getAll()
        .then((response) => {
          this.admins = response.data;
          console.log(this.admins);
        })
        .catch((e) => {
          console.log(e);
        });

      // Narrow down to events in the future
    },
  },
};
</script>

<style scoped></style>
