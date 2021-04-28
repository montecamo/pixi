<template>
  <div
    class="wrapper"
    :style="{ width: `${width * scale}px`, height: `${height * scale}px` }"
  >
    <canvas :width="width" :height="height" class="canvas" ref="canvas" />
    <div
      :style="{
        left: `${focusArea.coordinates.x * scale}px`,
        top: `${focusArea.coordinates.y * scale}px`,
        width: `${focusArea.width * scale}px`,
        height: `${focusArea.height * scale}px`,
      }"
      class="focus-area"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, inject } from "vue";
import { renderFiber } from "../fibers";
import type { Fibers } from "../fibers";
import { Observable } from "rxjs";

export default defineComponent({
  props: ["focusArea", "width", "height", "canvasRef"],
  emits: ["update:canvasRef"],
  setup(_, { emit }) {
    const canvas = ref(null);
    const fibers$ = inject<Observable<Fibers>>("fibers$");
    const referenceCanvasScale = inject("referenceCanvasScale");

    onMounted(() => {
      emit("update:canvasRef", canvas.value);
      if (fibers$) {
        fibers$.subscribe((fibers) => {
          // @ts-ignore
          const ctx = canvas.value.getContext("2d");

          if (ctx) {
            fibers.forEach((f) => {
              renderFiber(ctx, f);
            });
          }
        });
      }
    });

    return { canvas, scale: referenceCanvasScale };
  },
});
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 32px;
  right: 32px;
}

.canvas {
  border: 1px solid #fff;
  width: 100%;
  height: 100%;
  position: relative;
  overflow: auto;
}

.focus-area {
  border: 1px solid var(--primary-color);
  position: absolute;
  pointer-events: none;
}
</style>
