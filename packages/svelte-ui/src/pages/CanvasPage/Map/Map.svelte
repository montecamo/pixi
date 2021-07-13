<script lang="ts">
  import { onMount } from "svelte";
  import { renderFiber } from "src/stores/fibers";
  import { fibers$ } from "src/stores/fibers/fibers";
  import { moveArea, zoom, focusArea$ } from "src/stores/focusArea";
  import { MAP_SCALE } from "src/constants";
  import { fromMousePressedMove$ } from "src/reactiveUtils";
  import { map, withLatestFrom } from "rxjs/operators";
  import { MAP_WIDTH, MAP_HEIGHT } from "src/constants";

  import {
    makeMouseWheelDelta$,
    makeMouseMoveCoordinates$,
    stopDefaults$,
  } from "src/reactiveUtils";

  export let canvas: HTMLCanvasElement = null;

  onMount(() => {
    fibers$.subscribe((fibers) => {
      const ctx = canvas.getContext("2d");

      fibers.forEach((f) => {
        renderFiber(ctx, f);
      });
    });
  });

  onMount(() => {
    const subscription = fromMousePressedMove$(canvas)
      .pipe(
        stopDefaults$(),
        map(({ offsetX, offsetY }) => ({
          x: offsetX / MAP_SCALE,
          y: offsetY / MAP_SCALE,
        }))
      )
      .subscribe(moveArea);

    return () => subscription.unsubscribe();
  });

  onMount(() => {
    const move$ = makeMouseMoveCoordinates$(canvas).pipe(
      map(({ x, y }) => ({
        x: x / MAP_SCALE,
        y: y / MAP_SCALE,
      }))
    );
    const wheelDelta$ = makeMouseWheelDelta$(canvas);

    const subscription = wheelDelta$
      .pipe(withLatestFrom(move$))
      .subscribe(([delta, coordinates]) => zoom({ delta, coordinates }));

    return () => subscription.unsubscribe();
  });
</script>

<div
  class="wrapper"
  style="width: {MAP_WIDTH * MAP_SCALE}px; height: {MAP_HEIGHT * MAP_SCALE}px"
>
  <canvas
    width={MAP_WIDTH}
    height={MAP_HEIGHT}
    class="canvas"
    bind:this={canvas}
  />
  <div
    style="
    left: {$focusArea$.coordinates.x * MAP_SCALE}px;
    top: {$focusArea$.coordinates.y * MAP_SCALE}px;
    width: {$focusArea$.width * MAP_SCALE}px;
    height: {$focusArea$.height * MAP_SCALE}px;
  "
    class="focus-area"
  />
</div>

<style>
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
    background: var(--background-color);
  }

  .focus-area {
    border: 1px solid var(--primary-color);
    position: absolute;
    pointer-events: none;
  }
</style>
