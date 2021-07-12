<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { Observable, Subject, merge } from "rxjs";
  import { withLatestFrom, map, tap } from "rxjs/operators";
  import { scaleFiber, moveFiber, renderFiber } from "src/stores/fibers";
  import { fibers$, getFibers } from "src/stores/fibers/fibers";
  import type { Fibers } from "src/stores/fibers";
  import { focusAreaObservable$, changeRatio } from "src/stores/focusArea";

  import { makeElementRatio$ } from "src/reactiveUtils";

  export let canvas: HTMLCanvasElement = null;

  let width: number;
  let height: number;

  const scale$ = getContext<Observable<number>>("scale$");

  const manual$ = new Subject<Fibers>();

  focusAreaObservable$.subscribe(({ width, height, coordinates }) => {
    manual$.next(getFibers(coordinates.x, coordinates.y, width, height));
  });

  onMount(() => {
    const subscription = makeElementRatio$(canvas).subscribe(changeRatio);

    return () => subscription.unsubscribe();
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
        withLatestFrom(focusAreaObservable$, scale$),
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
