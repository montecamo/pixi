<template>
  <Canvas
    :brushSize="brushSize"
    :brushColor="brushColor"
    v-model:canvas-ref="canvasRef"
  />
  <ReferenceCanvas
    :width="canvasWidth"
    :height="canvasHeight"
    :focusArea="focusArea"
    v-model:canvas-ref="referenceCanvasRef"
  />
  <UsersComp />
  <Dock />
</template>

<script lang="ts">
import Canvas from "./components/Canvas.vue";
import ReferenceCanvas from "./components/ReferenceCanvas.vue";
import UsersComp from "./components/Users.vue";
import MainPage from "./components/MainPage.vue";
import Dock from "./components/ControlsDock";

import { merge, Observable, combineLatest } from "rxjs";
import { withLatestFrom, filter, map, tap } from "rxjs/operators";
import type { Api } from "./api";
import { makeFiber, moveFiber, scaleFiber, renderFiber } from "./fibers";
import type { Fibers } from "./fibers";

const MIN_ZOOM = 10;
const MAX_ZOOM = 100;
const DELTA_SPEED = 0.5;
const INITIAL_ZOOM = 20;
const REFERENCE_CANVAS_SCALE = 0.1;

import { ref, defineComponent, provide, inject } from "vue";
import {
  makeElementZoom$,
  makeElementRatio$,
  makeMousePressedMoveVector$,
  makeMousePressedMoveCoordinates$,
  makeMouseMoveCoordinates$,
  makeExtendableObservable$,
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
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    Canvas,
    ReferenceCanvas,
    UsersComp,
    Dock,
  },
  setup() {
    const canvasRef = ref(null);
    const referenceCanvasRef = ref(null);
    const api = inject<Api>("api") as Api;
    const val = ref(0);
    const route = useRoute();

    const brushSize = ref(24);
    const brushColor = ref("#fff");
    const canvasWidth = ref(2000);
    const canvasHeight = ref(2000);
    const focusArea = ref({
      width: 100,
      height: 100,
      coordinates: { x: 2, y: 2 },
    });
    const brushColor$ = useAsObservable(brushColor);
    const brushSize$ = useAsObservable(brushSize);
    const fibers$ = makeExtendableObservable$<Fibers>([]);

    const canvas$ = useAsObservable<HTMLCanvasElement | null>(canvasRef).pipe(
      filter(notNull)
    );
    const referenceCanvas$ = useAsObservable<HTMLCanvasElement | null>(
      referenceCanvasRef
    ).pipe(filter(notNull));

    const coordinates$ = makeMousePressedMoveCoordinates$(
      referenceCanvas$
    ).pipe(
      map(({ x, y }) => ({
        x: x / REFERENCE_CANVAS_SCALE,
        y: y / REFERENCE_CANVAS_SCALE,
      }))
    );
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

    api.joinRoom(route.params.id as string);

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

    fibers$.attachSource(api.fibers$);
    fibers$.attachSource(localFibers$);

    localFibers$.subscribe((fibers) => {
      api.draw(fibers);
    });

    provide("focusArea$", focusArea$);
    provide("scale$", scale$);
    provide("fibers$", fibers$.observable$);
    provide("referenceCanvasScale", REFERENCE_CANVAS_SCALE);
    provide("brushSize", brushSize);
    provide("brushColor", brushColor);
    provide("updateBrushSize", (val: number) => {
      brushSize.value = val;
    });
    provide("updateBrushColor", (val: string) => {
      brushColor.value = val;
    });

    return {
      canvasRef,
      referenceCanvasRef,
      brushColor,
      brushSize,
      focusArea,
      canvasWidth,
      canvasHeight,
      api,
      val,
    };
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
