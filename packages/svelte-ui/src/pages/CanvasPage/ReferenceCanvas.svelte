<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { renderFiber } from "src/stores/fibers";
  import type { FocusArea } from "src/canvas";
  import { fibers$ } from "src/stores/fibers/fibers";
  import { moveArea } from "src/stores/focusArea";
  import { REFERENCE_CANVAS_SCALE } from "src/constants";
  import { fromMousePressedMove$ } from "src/reactiveUtils";
  import { map } from "rxjs/operators";

  export let referenceCanvas: HTMLCanvasElement = null;
  export let width: number;
  export let height: number;
  export let focusArea: FocusArea;

  const scale = getContext<number>("referenceCanvasScale");

  onMount(() => {
    fibers$.subscribe((fibers) => {
      const ctx = referenceCanvas.getContext("2d");

      fibers.forEach((f) => {
        renderFiber(ctx, f);
      });
    });
  });

  onMount(() => {
    const subscription = fromMousePressedMove$(referenceCanvas)
      .pipe(
        map(({ offsetX, offsetY }) => ({
          x: offsetX / REFERENCE_CANVAS_SCALE,
          y: offsetY / REFERENCE_CANVAS_SCALE,
        }))
      )
      .subscribe(moveArea);

    return () => subscription.unsubscribe();
  });
</script>

<div
  class="wrapper"
  style="width: {width * scale}px; height: {height * scale}px"
>
  <canvas {width} {height} class="canvas" bind:this={referenceCanvas} />
  <div
    style="
    left: {focusArea.coordinates.x * scale}px;
    top: {focusArea.coordinates.y * scale}px;
    width: {focusArea.width * scale}px;
    height: {focusArea.height * scale}px;
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
  }

  .focus-area {
    border: 1px solid var(--primary-color);
    position: absolute;
    pointer-events: none;
  }
</style>
