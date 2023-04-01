<template>
  <v-autocomplete
    v-model="selectedItem"
    :items="filteredItems"
    label="Select Item"
    :search-input.sync="search"
    :loading="loading"
    :filter="customFilter"
  ></v-autocomplete>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      selectedItem: null,
      items: [],
      search: "",
      loading: false,
    };
  },
  computed: {
    filteredItems() {
      return this.items.filter((item) =>
        this.customFilter(item, this.search, item.text)
      );
    },
  },
  methods: {
    customFilter(item, queryText, itemText) {
      return (
        itemText.toLowerCase().indexOf(queryText.toLowerCase()) !== -1 &&
        queryText.length >= 2
      );
    },
    fetchItems() {
      this.loading = true;
      axios.get("https://api.example.com/items").then((response) => {
        this.items = response.data;
        this.loading = false;
      });
    },
  },
  watch: {
    items() {
      this.selectedItem = null;
    },
  },
  created() {
    this.fetchItems();
  },
};
</script>
