<script lang="ts">
  import { getContext, setContext } from "svelte";
  import Canvas from "./Canvas.svelte";
  import ReferenceCanvas from "./ReferenceCanvas.svelte";
  import UsersComp from "./Users.svelte";
  import { Dock } from "./ControlsDock";
  import { brushObservable$ } from "src/stores/brush";

  import { Observable, BehaviorSubject } from "rxjs";
  import { addFibers } from "src/stores/fibers/fibers";
  import { withLatestFrom, map, filter } from "rxjs/operators";
  import type { Api } from "src/api";
  import { makeFiber, moveFiber, scaleFiber } from "src/stores/fibers";
  import type { Fibers } from "src/stores/fibers";
  import {
    focusArea$,
    focusAreaObservable$,
    changeRatio,
  } from "src/stores/focusArea";

  const CANVAS_SIZE = 2000;
  const REFERENCE_CANVAS_SCALE = 0.1;

  import {
    makeElementRatio$,
    makeMousePressedMoveVector$,
  } from "src/reactiveUtils";
  import { makeFocusAreaScale$ } from "src/canvas";

  let canvas: HTMLCanvasElement;
  let referenceCanvas: HTMLCanvasElement;

  const api = getContext<Api>("api");
  export let roomId: string;

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

  const ratio$ = makeElementRatio$(canvas$);
  ratio$.subscribe(changeRatio);

  const scale$ = makeFocusAreaScale$(canvas$, focusAreaObservable$);

  const moveVector$ = makeMousePressedMoveVector$(canvas$);

  const localFibers$: Observable<Fibers> = moveVector$.pipe(
    withLatestFrom(brushObservable$),
    map(([{ fromX, fromY, toX, toY }, { color, size }]) => {
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

  setContext("scale$", scale$);
  setContext("referenceCanvasScale", REFERENCE_CANVAS_SCALE);
  setContext("canvas$", canvas$);
</script>

<Canvas bind:canvas />
<ReferenceCanvas
  width={CANVAS_SIZE}
  height={CANVAS_SIZE}
  focusArea={$focusArea$}
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
