<template>
  <div class="wrapper">
    <canvas :width="width" :height="height" class="canvas" ref="canvas" />
    <div
      :style="{
        left: `${hole.left - 1}px`,
        top: `${hole.top - 1}px`,
        width: `${hole.width}px`,
        height: `${hole.height}px`,
      }"
      class="hole"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted } from "vue";

export default defineComponent({
  props: ["hole", "width", "height", "canvasRef"],
  emits: ["update:canvasRef"],
  setup(_, { emit }) {
    const canvas = ref(null);

    onMounted(() => {
      // @ts-ignore
      var ctx = canvas.value.getContext("2d");

      var img = new Image();
      img.onload = function () {
        ctx.drawImage(img, 0, 0); // Or at whatever offset you like
      };
      img.crossOrigin = "Anonymous";

      img.src =
        "https://images.unsplash.com/photo-1593642634443-44adaa06623a?ixid=MXwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1525&q=80";
    });

    console.warn("setu", _);
    watch(canvas, (r) => {
      console.warn("emit");
      emit("update:canvasRef", r);
    });

    return { canvas };
  },
});
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.1);
}

.canvas {
  border: 10px solid lightblue;
  position: relative;
  overflow: auto;
}

.hole {
  border: 10px solid lightcoral;
  position: absolute;
  pointer-events: none;
}
</style>
