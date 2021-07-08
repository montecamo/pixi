<script lang="ts">
  import { getContext, setContext } from "svelte";
  import Canvas from "./Canvas.svelte";
  import ReferenceCanvas from "./ReferenceCanvas.svelte";
  import UsersComp from "./Users.svelte";
  import { Dock } from "./ControlsDock";

  import { Observable, BehaviorSubject } from "rxjs";
  import { addFibers } from "src/stores/fibers/fibers";
  import { withLatestFrom, map, filter } from "rxjs/operators";
  import type { Api } from "src/api";
  import { makeFiber, moveFiber, scaleFiber } from "src/stores/fibers";
  import type { Fibers } from "src/stores/fibers";

  const CANVAS_SIZE = 2000;
  const MIN_ZOOM = 10;
  const MAX_ZOOM = 100;
  const DELTA_SPEED = 0.5;
  const INITIAL_ZOOM = 20;
  const REFERENCE_CANVAS_SCALE = 0.1;

  import {
    makeElementZoom$,
    makeElementRatio$,
    makeMousePressedMoveVector$,
    makeMousePressedMoveCoordinates$,
    makeExtendableObservable$,
  } from "src/reactiveUtils";
  import {
    makeFocusArea$,
    makeFocusAreaImageData$,
    makeFocusAreaScale$,
    applyScaledImageData,
  } from "src/canvas";
  import { writable, get } from "svelte/store";

  let canvas: HTMLCanvasElement;
  let referenceCanvas: HTMLCanvasElement;

  const api = getContext<Api>("api");
  export let roomId: string;

  let brushSize = writable(24);
  let brushColor = writable("#fff");
  let focusArea = {
    width: 100,
    height: 100,
    coordinates: { x: 2, y: 2 },
  };

  const brushColor$ = new BehaviorSubject(get(brushColor));
  brushColor.subscribe((v) => brushColor$.next(v));

  const brushSize$ = new BehaviorSubject(get(brushSize));
  brushSize.subscribe((v) => brushSize$.next(v));

  const canvasRaw$ = new BehaviorSubject<HTMLCanvasElement>(canvas);
  $: canvasRaw$.next(canvas);
  const canvas$ = canvasRaw$.pipe(filter<HTMLCanvasElement>(Boolean));
  const referenceCanvasRaw$ = new BehaviorSubject<HTMLCanvasElement>(
    referenceCanvas
  );
  $: referenceCanvasRaw$.next(referenceCanvas);
  const referenceCanvas$ = referenceCanvasRaw$.pipe(
    filter<HTMLCanvasElement>(Boolean)
  );

  const coordinates$ = makeMousePressedMoveCoordinates$(referenceCanvas$).pipe(
    map(({ x, y }) => ({
      x: x / REFERENCE_CANVAS_SCALE,
      y: y / REFERENCE_CANVAS_SCALE,
    }))
  );

  const zoom$ = makeElementZoom$(referenceCanvas$, {
    max: MAX_ZOOM,
    min: MIN_ZOOM,
    speed: DELTA_SPEED,
    initial: INITIAL_ZOOM,
  });

  const ratio$ = makeElementRatio$(canvas$);
  const focusArea$ = makeFocusArea$(
    coordinates$,
    new BehaviorSubject({ width: CANVAS_SIZE, height: CANVAS_SIZE }),
    ratio$,
    zoom$
  );

  const scale$ = makeFocusAreaScale$(canvas$, focusArea$);

  // const focusAreaImageData$ = makeFocusAreaImageData$(
  // referenceCanvas$,
  // focusArea$
  // );

  // applyScaledImageData(canvas$, scale$, focusAreaImageData$);

  focusArea$.subscribe((area) => {
    focusArea = area;
  });

  const moveVector$ = makeMousePressedMoveVector$(canvas$);

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

  api.fibers$.subscribe(addFibers);
  localFibers$.subscribe(addFibers);

  localFibers$.subscribe((fibers) => {
    api.draw(fibers);
  });

  api.joinRoom(roomId);

  setContext("focusArea$", focusArea$);
  setContext("scale$", scale$);
  setContext("referenceCanvasScale", REFERENCE_CANVAS_SCALE);
  setContext("brushSize", brushSize);
  setContext("brushColor", brushColor);
  setContext("updateBrushSize", (val: number) => {
    brushSize.set(val);
  });
  setContext("updateBrushColor", (val: string) => {
    brushColor.set(val);
  });
  setContext("canvas$", canvas$);
</script>

<Canvas bind:canvas />
<ReferenceCanvas
  width={CANVAS_SIZE}
  height={CANVAS_SIZE}
  {focusArea}
  bind:referenceCanvas
/>
<UsersComp />
<Dock />

<style>
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap");

  @import "../../variables.css";

  :global(#root) {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  :global(html),
  :global(body) {
    margin: 0;
    height: 100%;
  }
</style>
