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
          label="Date"
          :items="pg1filteredEvents"
          item-value="id"
          item-title="title"
          @update:modelValue="eventSearchUpdate()"
        ></v-combobox>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="9">
        <!-- <TestEx></TestEx> -->
        <v-data-table
          :headers="pg1stuHeaders"
          :items="pg1critiques"
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

    <v-data-table
      :headers="headers"
      :items="desserts"
      :sort-by="[{ key: 'calories', order: 'asc' }]"
      class="elevation-1"
    >
      <template v-slot:top>
        <v-toolbar flat>
          <v-toolbar-title>My CRUD</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <v-spacer></v-spacer>
          <v-dialog v-model="dialog" max-width="500px">
            <template v-slot:activator="{ props }">
              <v-btn color="primary" dark class="mb-2" v-bind="props">
                New Item
              </v-btn>
            </template>
            <v-card>
              <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.name"
                        label="Dessert name"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.calories"
                        label="Calories"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.fat"
                        label="Fat (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.carbs"
                        label="Carbs (g)"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field
                        v-model="editedItem.protein"
                        label="Protein (g)"
                      ></v-text-field>
                    </v-col>
                  </v-row>
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
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete"
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
        </v-toolbar>
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon size="small" class="me-2" @click="editItem(item.raw)">
          mdi-pencil
        </v-icon>
        <v-icon size="small" @click="deleteItem(item.raw)"> mdi-delete </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn color="primary" @click="initialize"> Reset </v-btn>
      </template>
    </v-data-table>
  </v-container>
  <v-container v-else-if="searchByIndex == 'Student Name'">test 2</v-container>
</template>
<script>
import SemesterDataService from "../../services/SemesterDataService";
import EventDataService from "../../services/EventDataService";
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
      { title: "First Name", key: "studentFName" },
      { title: "Last Name", key: "studentLName" },
      { title: " " },
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
    this.pg1semesters.forEach(
      (obj) => (obj.title = obj.year + " - " + obj.code)
    );
    this.pg1events.forEach((obj) => (obj.title = obj.date + " - " + obj.type));
    this.pg1filteredEvents = this.pg1events;
  },
  computed: {
    console: () => console,
  },
};
</script>
