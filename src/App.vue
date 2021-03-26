<template>
  <Canvas
    :brushSize="brushSize"
    :brushColor="brushColor"
    v-model:actions="actions"
  />
  <BrushSize v-model:brush-size="brushSize" />
  <BrushColor v-model:brush-color="brushColor" />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Canvas from "./components/Canvas.vue";
import BrushSize from "./components/BrushSize.vue";
import BrushColor from "./components/BrushColor.vue";

export default defineComponent({
  name: "App",
  components: {
    Canvas,
    BrushSize,
    BrushColor,
  },
  data() {
    return { brushSize: 2, brushColor: "#000", actions: [] };
  },

  watch: {
    actions(actions) {
      console.warn("actions", (actions.length * 4 * 32) / 8 / 1024);
    },
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

html,
body {
  margin: 0;
}
</style>
