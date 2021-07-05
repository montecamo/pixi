<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { FocusArea } from "src/canvas";
  import type { Observable } from "rxjs";
  import { withLatestFrom, map } from "rxjs/operators";
  import { scaleFiber, moveFiber, renderFiber } from "src/fibers";
  import type { Fibers } from "src/fibers";

  export let canvas: HTMLCanvasElement = null;

  let width: number;
  let height: number;

  const fibers$ = getContext<Observable<Fibers>>("fibers$");
  const focusArea$ = getContext<Observable<FocusArea>>("focusArea$");
  const scale$ = getContext<Observable<number>>("scale$");

  onMount(() => {
    fibers$
      .pipe(
        withLatestFrom(focusArea$, scale$),
        map(([fibers, { coordinates }, scale]) => {
          return fibers.map((f) =>
            scaleFiber(moveFiber(f, -coordinates.x, -coordinates.y), 1 / scale)
          );
        })
      )
      .subscribe((fibers) => {
        const ctx = canvas.getContext("2d");

        fibers.forEach((f) => {
          renderFiber(ctx, f);
        });
      });
  });
</script>

<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<canvas bind:this={canvas} class="canvas" {width} {height} />

<style scoped>
  .canvas {
    background: var(--background-color);
  }
</style>
