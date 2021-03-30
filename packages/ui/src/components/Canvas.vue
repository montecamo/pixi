<template>
  <canvas :width="width" :height="height" ref="canvas" />
</template>

<script lang="ts">
import { ref, watch, defineComponent } from "vue";

export default defineComponent({
  props: ["brushSize", "brushColor", "actions", "canvasRef"],
  emit: ["update:canvasRef"],
  setup(_, { emit }) {
    const canvas = ref(null);
    const width = ref(window.innerHeight);
    const height = ref(window.innerWidth);

    window.addEventListener("resize", () => {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    });

    watch(canvas, (r) => emit("update:canvasRef", r));

    return { canvas, width, height };
  },
});
</script>

<style scoped></style>
