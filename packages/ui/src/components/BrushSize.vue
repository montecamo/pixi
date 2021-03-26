<template>
  <div class="container">
    <div
      v-for="radius in radiuses"
      :key="radius"
      class="radius-container"
      :class="{ active: radius === brushSize }"
      @click="changeBrushSize(radius)"
    >
      <div
        class="radius"
        :style="{ width: `${radius}px`, height: `${radius}px` }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  emits: ["update:brushSize"],
  props: {
    brushSize: Number,
  },
  data() {
    return { radiuses: [8, 16, 24, 32, 40] };
  },
  methods: {
    changeBrushSize(size: number) {
      this.$emit("update:brushSize", size);
    },
  },
});
</script>

<style scoped>
.container {
  position: fixed;
  top: 50%;
  left: 0;

  transform: translateY(-50%);
}

.radius-container {
  width: 80px;
  height: 80px;
  position: relative;
  cursor: pointer;
}

.radius-container:hover {
  background: lightcoral;
}

.radius {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;

  transform: translate(-50%, -50%);
  background: black;
}
.radius-container.active {
  background: lightblue;
}
</style>
