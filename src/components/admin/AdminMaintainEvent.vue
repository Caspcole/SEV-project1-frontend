<template>
  <v-card>
    <v-card-title> Maintain Events: </v-card-title>
  </v-card>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="selectedSemester"
          label="Semester"
          :items="semesters"
          item-value="id"
          item-title="title"
          return-object
          @update:modelValue="semesterUpdated()"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-data-table
      :headers="eventHeaders"
      :items="events"
      class="elevation-1"
      :sort-by="[{ key: 'date', order: 'desc' }]"
    >
      <template #top>
        <v-toolbar flat>
          <v-toolbar-title> EVENTS </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn color="primary">Add Event</v-btn>
        </v-toolbar>
      </template>
      <template #item="{ item }">
        <tr>
          <td v-for="(header, index) in eventHeaders" :key="index">
            <div v-if="header.title == 'Date'">
              {{ this.formatDate(item.columns[header.key]) }}
            </div>
            <div
              v-else-if="
                header.title == 'Start Time' || header.title == 'End Time'
              "
            >
              {{ this.formatTime(item.columns[header.key]) }}
            </div>
            <div v-else-if="header.title == 'Actions'">
              <div v-if="this.isAfterToday(item.raw)">
                <v-icon size="small" class="me-2" @click="editEvent(item.raw)">
                  mdi-pencil
                </v-icon>
                <v-icon size="small" @click="deleteEvent(item.raw)">
                  mdi-delete
                </v-icon>
              </div>
              <div v-else>
                <v-text>Passed</v-text>
              </div>
            </div>
            <div v-else>
              {{ item.columns[header.key] }}
            </div>
          </td>
        </tr>
      </template>
    </v-data-table>
  </v-container>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
export default {
  name: "adminMaintainEvent",
  data: () => ({
    semesters: [],
    selectedSemester: null,
    events: [],
    eventHeaders: [
      { title: "Date", key: "date" },
      { title: "Title", key: "title" },
      { title: "Type", key: "type" },
      { title: "Start Time", key: "startTime" },
      { title: "End Time", key: "endTime" },
      { title: "Actions", sortable: false, allign: "end" },
    ],
  }),
  methods: {
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
          this.semesters.forEach(
            (obj) => (obj.title = obj.year + " - " + obj.code)
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getCurrentSemester() {
      this.currentDate = new Date();
      let dateString = this.currentDate.toISOString().substring(0, 10);
      await SemesterDataService.getCurrent(dateString)
        .then((response) => {
          this.selectedSemester = this.semesters.find(
            (obj) => obj.id == response.data[0].id
          );
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async semesterUpdated() {
      await EventDataService.getBySemester(this.selectedSemester.id)
        .then((response) => {
          this.events = response.data;
          console.log(this.events);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    formatDate(date) {
      if (date === null || date === undefined) {
        return date;
      }
      return new Date(date).toLocaleDateString("us-US", {
        month: "long",
        day: "numeric",
        timeZone: "UTC",
      });
    },
    formatTime(time) {
      if (time === null || time === undefined) {
        return time;
      }
      return new Date("January 1, 2000 " + time).toLocaleTimeString("us-EN", {
        hour: "numeric",
        minute: "numeric",
      });
    },
    isAfterToday(event) {
      let eventDate = new Date(event.date).getTime();
      let today = new Date().getTime();

      return eventDate > today;
    },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    await this.getCurrentSemester();
    await this.semesterUpdated();
  },
};
</script>
