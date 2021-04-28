<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent, provide } from "vue";
import { makeApi } from "./api";

export default defineComponent({
  name: "App",
  setup() {
    const api = makeApi();

    provide("api", api);
  },
});
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap");

@import "./variables.css";

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  margin: 0;
  height: 100%;
}
</style>
