<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-select
          v-model="selectedSemester"
          label="Semester"
          :items="semesters"
          item-value="id"
          item-title="title"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="filteredCritiques"
          class="elevation-1"
        >
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in pg1stuHeaders" :key="index">
                <div v-if="header.title != ' '">
                  {{ item.columns[header.key] }}
                </div>
                <div v-else>
                  <v-btn
                    small
                    color="primary"
                    @click="displayStudentCritiques(item.raw)"
                    >View Critiques</v-btn
                  >
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
export default {
  name: "facultyCritiqueView",
  data: () => ({
    semesters: [],
    selectedSemester: null,
    filteredCritiques: [],
    headers: [
      { title: "Event Date", key: "1" },
      { title: "First Name", key: "2" },
      { title: "Last Name", key: "3" },
      { title: "Event Type", key: "4" },
      { title: " " },
    ],
  }),
  methods: {
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.semesters = response.data;
        })
        .catch((e) => {
          console.log(e);
        });
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
    async retrieveAllEvents() {
      await EventDataService.getAll()
        .then((response) => {
          this.pg1events = response.data;
          this.pg1events.reverse();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    semesterSearchUpdate() {
      if (
        this.pg1selectedSemester === null ||
        this.pg1selectedSemester === undefined
      ) {
        this.pg1filteredEvents = this.pg1events;
      } else {
        if (this.pg1selectedSemester.id !== undefined) {
          this.pg1filteredEvents = this.pg1events.filter(
            (obj) => obj.semesterId === this.pg1selectedSemester.id
          );
        }
      }
    },
    async eventSearchUpdate() {
      if (
        this.pg1selectedEvent === null ||
        this.pg1selectedEvent === undefined
      ) {
        this.critiques = [];
      } else {
        if (this.pg1selectedEvent.id !== undefined) {
          await EventDataService.getCritiques(this.pg1selectedEvent.id)
            .then((response) => {
              this.pg1critiques = response.data;
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
    },
    displayStudentCritiques(student) {
      this.console.log(student);
    },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    await this.retrieveAllEvents();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));
  },
  computed: {
    console: () => console,
  },
};
</script>
