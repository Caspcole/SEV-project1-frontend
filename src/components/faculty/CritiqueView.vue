<template>
  <v-container>
    <v-row>
      <v-col cols="3">
        <v-select
          clearable
          v-model="searchByIndex"
          label="Search by"
          :items="searchByList"
        ></v-select>
      </v-col>
    </v-row>
  </v-container>

  <v-divider></v-divider>

  <v-container v-if="searchByIndex == 'Event Date'">
    <v-row>
      <v-col cols="4">
        <v-combobox
          clearable
          v-model="pg1selectedSemester"
          label="Semester (optional)"
          :items="pg1semesters"
          item-value="id"
          item-title="title"
          @update:modelValue="semesterSearchUpdate()"
        ></v-combobox>
      </v-col>
      <v-col cols="1"> </v-col>
      <v-col cols="4">
        <v-combobox
          clearable
          v-model="pg1selectedEvent"
          label="Events"
          :items="pg1filteredEvents"
          item-value="id"
          item-title="title"
          @update:modelValue="eventSearchUpdate()"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <TestEx></TestEx>
        <!-- <v-data-table
          :headers="pg1stuHeaders"
          :items="pg1critiques"
          class="elevation-1"
        >
          <template #item.actions="{ item }">
            {{ console.log("item.actions slot called for:", item) }}
          </template>
        </v-data-table> -->
      </v-col>
    </v-row>
    <!-- <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>My CRUD</v-toolbar-title>
              <v-divider class="mx-4" inset vertical></v-divider>
              <v-spacer></v-spacer>
            </v-toolbar>
          </template> -->
    <!-- <template v-slot:no-data>
            <v-btn color="primary" @click="initialize"> Reset </v-btn>
          </template> -->

    <!-- <v-dialog v-model="dialog" max-width="500px">
      <v-card v-for="faculty in pg1critiques">
        <v-card-title>
          <span class="text-h5">{{ faculty.critiquerName }}</span>
        </v-card-title>

        <v-card-text>
          <v-container>
            <v-text-field
              v-model="editedItem.name"
              label="Dessert name"
            ></v-text-field>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="close">
            Cancel
          </v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog> 
                  <v-dialog v-model="dialogDelete" max-width="500px">
                <v-card>
                  <v-card-title class="text-h5"
                    >Are you sure you want to delete this item?</v-card-title
                  >
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="closeDelete"
                      >Cancel</v-btn
                    >
                    <v-btn
                      color="blue-darken-1"
                      variant="text"
                      @click="deleteItemConfirm"
                      >OK</v-btn
                    >
                    <v-spacer></v-spacer>
                  </v-card-actions>
                </v-card>
              </v-dialog>
  -->
  </v-container>
  <v-container v-else-if="searchByIndex == 'Student Name'">test 2</v-container>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
import TestEx from "./test.vue";
export default {
  name: "facultyCritiqueView",
  data: () => ({
    searchByList: ["Event Date", "Student Name"],
    searchByIndex: null,
    pg1semesters: [],
    pg1selectedSemester: null,
    pg1events: [],
    pg1filteredEvents: [],
    pg1selectedEvent: null,
    pg1critiques: [],
    pg1stuHeaders: [
      { title: "First Name", align: "start", key: "studentFName" },
      { title: "Last Name", align: "start", key: "studentLName" },
      { title: "", align: "start", sortable: false },
      { title: "", align: "start", sortable: false },
      {
        title: "Action",
        align: "end",
        sortable: false,
      },
    ],
  }),
  methods: {
    async retrieveAllSemesters() {
      await SemesterDataService.getAll()
        .then((response) => {
          this.pg1semesters = response.data;
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
        this.filteredEvents = this.pg1events;
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
  },
  async mounted() {
    await this.retrieveAllSemesters();
    await this.retrieveAllEvents();
    this.pg1semesters.forEach(
      (obj) => (obj.title = obj.year + " - " + obj.code)
    );
    this.pg1events.forEach((obj) => (obj.title = obj.type + " - " + obj.date));
    this.pg1filteredEvents = this.pg1events;
  },
  components: {
    TestEx,
  },
};
</script>
