<template>
  <canvas class="canvas" :width="width" :height="height" ref="canvas" />
</template>

<script lang="ts">
//<canvas
// class="canvas"
// :width="width * 2"
// :height="height * 2"
// :style="{
// width: `${width}px`,
// height: `${height}px`,
// }"
// ref="canvas"
// />

import { ref, watch, defineComponent, inject, onMounted } from "vue";
import type { FocusArea } from "@/canvas";
import { Observable } from "rxjs";
import { withLatestFrom, map } from "rxjs/operators";
import { scaleFiber, moveFiber, renderFiber } from "@/fibers";
import type { Fibers } from "@/fibers";

export default defineComponent({
  props: ["canvasRef"],
  emit: ["update:canvasRef"],
  setup(_, { emit }) {
    const canvas = ref(null);
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);
    const brushSize = inject<number>("brushSize")!;
    const brushColor = inject<string>("brushColor")!;

    const fibers$ = inject<Observable<Fibers>>("fibers$");
    const focusArea$ = inject<Observable<FocusArea>>("focusArea$");
    const scale$ = inject<Observable<number>>("scale$");

    window.addEventListener("resize", () => {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    });

    onMounted(() => {
      emit("update:canvasRef", canvas.value);

      if (fibers$ && focusArea$ && scale$) {
        fibers$
          .pipe(
            withLatestFrom(focusArea$, scale$),
            map(([fibers, { coordinates }, scale]) => {
              return fibers.map((f) =>
                scaleFiber(
                  moveFiber(f, -coordinates.x, -coordinates.y),
                  1 / scale
                )
              );
            })
          )
          .subscribe((fibers) => {
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

    return { canvas, width, height, brushSize, brushColor };
  },
});
</script>

<style scoped>
.canvas {
  background: var(--background-color);
}
</style>
