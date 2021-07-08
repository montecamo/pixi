<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { renderFiber } from "src/fibers";
  import type { Fibers } from "src/fibers";
  import type { Observable } from "rxjs";
  import type { FocusArea } from "src/canvas";

  export let referenceCanvas: HTMLCanvasElement = null;
  export let width: number;
  export let height: number;
  export let focusArea: FocusArea;

  const fibers$ = getContext<Observable<Fibers>>("fibers$");
  const scale = getContext<number>("referenceCanvasScale");

  onMount(() => {
    fibers$.subscribe((fibers) => {
      const ctx = referenceCanvas.getContext("2d");

      fibers.forEach((f) => {
        renderFiber(ctx, f);
      });
    });
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
