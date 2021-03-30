<template>
  <Canvas
    :brushSize="brushSize"
    :brushColor="brushColor"
    v-model:canvas-ref="canvasRef"
  />
  <BrushSize v-model:brush-size="brushSize" />
  <BrushColor v-model:brush-color="brushColor" />
  <ReferenceCanvas
    :width="canvasWidth"
    :height="canvasHeight"
    :hole="hole"
    v-model:canvas-ref="referenceCanvasRef"
  />
</template>

<script lang="ts">
import Canvas from "./components/Canvas.vue";
import BrushSize from "./components/BrushSize.vue";
import BrushColor from "./components/BrushColor.vue";
import ReferenceCanvas from "./components/ReferenceCanvas.vue";
import { BehaviorSubject } from "rxjs";
import { withLatestFrom } from "rxjs/operators";

import { onMounted, ref, defineComponent, nextTick } from "vue";
import {
  makeHole$,
  applyCanvasHole,
  makeHoleImageData$,
  makeHoleScale$,
  makeMousePressedDelta$,
} from "./utils";
import { useAsObservable } from "./hooks/useAsObservable";

export default defineComponent({
  name: "App",
  components: {
    Canvas,
    BrushSize,
    BrushColor,
    ReferenceCanvas,
  },
  setup() {
    const canvasRef = ref(null);

    const referenceCanvasRef = ref(null);
    const brushSize = ref(2);
    const brushColor = ref("#000");
    const canvasWidth = ref(2000);
    const canvasHeight = ref(2000);
    const hole = ref({ width: 100, height: 100, left: 2, top: 2 });
    const brushColor$ = useAsObservable(brushColor);
    const brushSize$ = useAsObservable(brushSize);

    onMounted(() => {
      nextTick(() => {
        const referenceCanvas = referenceCanvasRef.value;
        const canvas = canvasRef.value;

        console.warn("w", referenceCanvas, canvas);

        if (referenceCanvas && canvas) {
          const hole$ = makeHole$(referenceCanvas, canvas);
          const scale$ = makeHoleScale$(canvas, hole$);
          const holeImageData$ = makeHoleImageData$(referenceCanvas, hole$);

          applyCanvasHole(canvas, scale$, holeImageData$);

          hole$.subscribe((h) => {
            hole.value = h;
          });

          const pressedDelta$ = makeMousePressedDelta$(
            new BehaviorSubject(canvas)
          );

          pressedDelta$
            .pipe(withLatestFrom(brushColor$, brushSize$, scale$))
            .subscribe(([{ x, y, toX, toY }, color, size, scale]) => {
              // @ts-ignore
              const ctx = canvas.getContext("2d");

              if (ctx) {
                ctx.lineCap = "round";
                ctx.lineJoin = "round";
                ctx.fillStyle = ctx.strokeStyle = color;
                ctx.lineWidth = size;

                ctx.beginPath();
                ctx.moveTo(x / scale, y / scale);
                ctx.lineTo(toX / scale, toY / scale);
                ctx.stroke();
              }
            });

          pressedDelta$
            .pipe(withLatestFrom(brushColor$, brushSize$, scale$, hole$))
            .subscribe(
              ([{ x, y, toX, toY }, color, size, scale, { left, top }]) => {
                // @ts-ignore
                const ctx = referenceCanvas.getContext("2d");

                if (ctx) {
                  ctx.lineCap = "round";
                  ctx.lineJoin = "round";
                  ctx.fillStyle = ctx.strokeStyle = color;
                  ctx.lineWidth = size;

                  ctx.beginPath();
                  ctx.moveTo(x / scale + left, y / scale + top);
                  ctx.lineTo(toX / scale + left, toY / scale + top);
                  ctx.stroke();
                }
              }
            );
        }
      });
    });

    return {
      canvasRef,
      referenceCanvasRef,
      brushColor,
      brushSize,
      hole,
      canvasWidth,
      canvasHeight,
    };
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
  height: 100%;
}

html,
body {
  margin: 0;
  height: 100%;
}
</style>
