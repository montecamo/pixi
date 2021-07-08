<script lang="ts">
  import { getContext, onMount } from "svelte";
  import type { FocusArea } from "src/canvas";
  import { Observable, Subject, merge } from "rxjs";
  import { withLatestFrom, map, tap } from "rxjs/operators";
  import { scaleFiber, moveFiber, renderFiber } from "src/fibers";
  import { fibers$, getFibers } from "src/stores/fibers";
  import type { Fibers } from "src/fibers";

  export let canvas: HTMLCanvasElement = null;

  let width: number;
  let height: number;

  const focusArea$ = getContext<Observable<FocusArea>>("focusArea$");
  const scale$ = getContext<Observable<number>>("scale$");

  const manual$ = new Subject<Fibers>();

  focusArea$.subscribe(({ width, height, coordinates }) => {
    manual$.next(getFibers(coordinates.x, coordinates.y, width, height));
  });

  onMount(() => {
    merge(
      fibers$,
      manual$.pipe(
        tap(() => {
          const ctx = canvas.getContext("2d");
          ctx?.clearRect(0, 0, canvas.width, canvas.height);
        })
      )
    )
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
