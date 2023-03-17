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
          @update:modelValue="semesterSearchUpdate(selectedSemester)"
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
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>FILTER BY</v-toolbar-title>
              <v-select
                clearable
                v-model="studentFilter"
                label="Student"
                :items="studentFilterArray"
                :style="{ width: '70px' }"
                @update:modelValue="filterCritiques()"
              ></v-select>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-select
                clearable
                v-model="typeFilter"
                label="Event Type"
                :items="typeFilterArray"
                :style="{ width: '70px' }"
                @update:modelValue="filterCritiques()"
              ></v-select>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-select
                clearable
                v-model="monthFilter"
                label="Month"
                :items="monthFilterArray"
                :style="{ width: '70px' }"
                @update:modelValue="filterCritiques()"
              ></v-select>
            </v-toolbar>
          </template>
          <template #item="{ item }">
            <tr>
              <td v-for="(header, index) in headers" :key="index">
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
    semesterCritiques: [],
    filteredCritiques: [],
    studentFilterArray: [],
    studentFilter: null,
    typeFilterArray: [],
    typeFilter: null,
    monthFilterArray: [],
    monthFilter: null,
    headers: [
      { title: "Event Date", key: "eventDate" },
      { title: "First Name", key: "studentFName" },
      { title: "Last Name", key: "studentLName" },
      { title: "Event Type", key: "eventType" },
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
    async semesterSearchUpdate(semester) {
      await EventDataService.getSemesterCritiques(semester)
        .then((response) => {
          this.semesterCritiques = response.data;
          this.semesterCritiques.forEach(
            (obj) => (obj.stuName = obj.studentFName + " " + obj.studentLName)
          );
          this.filteredCritiques = this.semesterCritiques;
          this.fillFilters();
        })
        .catch((e) => {
          console.log(e);
        });
    },
    displayStudentCritiques(student) {
      this.console.log(student);
    },
    fillFilters() {
      let set = new Set();
      this.studentFilter = undefined;
      this.semesterCritiques.forEach((obj) => set.add(obj.stuName));
      this.studentFilterArray = Array.from(set);

      set = new Set();
      this.typeFilter = undefined;
      this.semesterCritiques.forEach((obj) => set.add(obj.eventType));
      this.typeFilterArray = Array.from(set);
    },
    filterCritiques() {
      this.filteredCritiques = this.semesterCritiques;
      if (this.studentFilter != undefined) {
        this.filteredCritiques = this.filteredCritiques.filter(
          (obj) => obj.stuName == this.studentFilter
        );
      }
      if (this.typeFilter != undefined) {
        this.filteredCritiques = this.filteredCritiques.filter(
          (obj) => obj.eventType == this.typeFilter
        );
      }
    },
  },
  async mounted() {
    await this.retrieveAllSemesters();
    this.semesters.forEach((obj) => (obj.title = obj.year + " - " + obj.code));

    await this.getCurrentSemester();
    this.selectedSemester = this.semesters.find((obj) => obj.id == 15);
    await this.semesterSearchUpdate(this.selectedSemester.id);
  },
  computed: {
    console: () => console,
  },
};
</script>
