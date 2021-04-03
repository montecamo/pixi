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
    :focusArea="focusArea"
    v-model:canvas-ref="referenceCanvasRef"
  />
  <UsersComp />
</template>

<script lang="ts">
import Canvas from "./components/Canvas.vue";
import BrushSize from "./components/BrushSize.vue";
import BrushColor from "./components/BrushColor.vue";
import ReferenceCanvas from "./components/ReferenceCanvas.vue";
import UsersComp from "./components/Users.vue";

import { merge, Observable, combineLatest } from "rxjs";
import { withLatestFrom, filter, map, tap } from "rxjs/operators";
import { makeApi } from "./api";
import { makeFiber, moveFiber, scaleFiber, renderFiber } from "./fibers";
import type { Fibers } from "./fibers";

const MIN_ZOOM = 10;
const MAX_ZOOM = 100;
const DELTA_SPEED = 0.5;
const INITIAL_ZOOM = 20;

import { ref, defineComponent, provide } from "vue";
import {
  makeElementZoom$,
  makeElementRatio$,
  makeMousePressedMoveVector$,
  makeMousePressedMoveCoordinates$,
  makeMouseMoveCoordinates$,
} from "./reactiveUtils";
import {
  makeFocusArea$,
  makeFocusAreaImageData$,
  makeFocusAreaScale$,
  applyScaledImageData,
} from "./canvas";
import { makeUser } from "./users";
import { notNull } from "./utils";
import { useAsObservable } from "./hooks/useAsObservable";

export default defineComponent({
  name: "App",
  components: {
    Canvas,
    BrushSize,
    BrushColor,
    ReferenceCanvas,
    UsersComp,
  },
  setup() {
    const canvasRef = ref(null);
    const referenceCanvasRef = ref(null);
    const api = makeApi();

    const brushSize = ref(2);
    const brushColor = ref("#000");
    const canvasWidth = ref(2000);
    const canvasHeight = ref(2000);
    const focusArea = ref({
      width: 100,
      height: 100,
      coordinates: { x: 2, y: 2 },
    });
    const brushColor$ = useAsObservable(brushColor);
    const brushSize$ = useAsObservable(brushSize);

    const canvas$ = useAsObservable<HTMLCanvasElement | null>(canvasRef).pipe(
      filter(notNull)
    );
    const referenceCanvas$ = useAsObservable<HTMLCanvasElement | null>(
      referenceCanvasRef
    ).pipe(filter(notNull));

    const coordinates$ = makeMousePressedMoveCoordinates$(referenceCanvas$);
    const coordinates2$ = makeMouseMoveCoordinates$(canvas$);

    const zoom$ = makeElementZoom$(referenceCanvas$, {
      max: MAX_ZOOM,
      min: MIN_ZOOM,
      speed: DELTA_SPEED,
      initial: INITIAL_ZOOM,
    });

    const ratio$ = makeElementRatio$(canvas$);
    const focusArea$ = makeFocusArea$(
      coordinates$,
      referenceCanvas$.pipe(map(({ width, height }) => ({ width, height }))),
      ratio$,
      zoom$
    );

    const scale$ = makeFocusAreaScale$(canvas$, focusArea$);
    const focusAreaImageData$ = makeFocusAreaImageData$(
      referenceCanvas$,
      focusArea$
    );

    applyScaledImageData(canvas$, scale$, focusAreaImageData$);

    focusArea$.subscribe((area) => {
      focusArea.value = area;
    });

    coordinates2$
      .pipe(withLatestFrom(focusArea$, scale$))
      .subscribe(([pos, { coordinates }, scale]) => {
        api.updateUser(
          makeUser("", {
            left: pos.x / scale + coordinates.x,
            top: pos.y / scale + coordinates.y,
          })
        );
      });

    const moveVector$ = makeMousePressedMoveVector$(canvas$);

    const { fibers$: serverFibers$ } = api;
    api.joinRoom(window.location.pathname.slice(1));

    const localFibers$: Observable<Fibers> = moveVector$.pipe(
      withLatestFrom(brushColor$, brushSize$),
      map(([{ fromX, fromY, toX, toY }, color, size]) => {
        return [makeFiber(fromX, fromY, toX, toY, color, size)];
      }),
      withLatestFrom(scale$, focusArea$),
      map(([fibers, scale, { coordinates }]) =>
        fibers.map((f) =>
          moveFiber(scaleFiber(f, scale), coordinates.x, coordinates.y)
        )
      )
    );

    const fibers$ = merge(serverFibers$, localFibers$);

    localFibers$.subscribe((fibers) => {
      api.draw(fibers);
    });

    fibers$
      .pipe(
        withLatestFrom(focusArea$, scale$),
        map(([fibers, { coordinates }, scale]) => {
          return fibers.map((f) =>
            scaleFiber(moveFiber(f, -coordinates.x, -coordinates.y), 1 / scale)
          );
        }),
        withLatestFrom(canvas$)
      )
      .subscribe(([fibers, canvas]) => {
        const ctx = canvas.getContext("2d");

        if (ctx) {
          fibers.forEach((f) => {
            renderFiber(ctx, f);
          });
        }
      });

    provide("api", api);
    provide("focusArea$", focusArea$);
    provide("scale$", scale$);

    return {
      canvasRef,
      referenceCanvasRef,
      brushColor,
      brushSize,
      focusArea,
      canvasWidth,
      canvasHeight,
      api,
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
