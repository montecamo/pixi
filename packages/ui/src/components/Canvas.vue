<template>
  <canvas :width="width" :height="height" ref="canvas" />
</template>

<script lang="ts">
import { ref, watch, defineComponent, inject, onMounted } from "vue";
import type { Api } from "../api";
import type { FocusArea } from "../canvas";
import { Observable } from "rxjs";
import { withLatestFrom, map } from "rxjs/operators";
import { scaleFiber, moveFiber, renderFiber } from "../fibers";

export default defineComponent({
  props: ["brushSize", "brushColor", "actions", "canvasRef"],
  emit: ["update:canvasRef"],
  setup(_, { emit }) {
    const canvas = ref(null);
    const width = ref(window.innerWidth);
    const height = ref(window.innerHeight);

    const api = inject<Api>("api");
    const focusArea$ = inject<Observable<FocusArea>>("focusArea$");
    const scale$ = inject<Observable<number>>("scale$");

    window.addEventListener("resize", () => {
      width.value = window.innerWidth;
      height.value = window.innerHeight;
    });

    onMounted(() => {
      if (api && focusArea$ && scale$) {
        api.fibers$
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

    watch(canvas, (r) => emit("update:canvasRef", r));

    return { canvas, width, height };
  },
});
</script>

<style scoped></style>
