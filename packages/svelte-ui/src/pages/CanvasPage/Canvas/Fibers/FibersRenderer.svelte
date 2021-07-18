<script lang="ts">
  import { Subject, merge } from "rxjs";
  import { map, tap } from "rxjs/operators";
  import { fibers$, getFibers } from "src/stores/fibers/fibers";
  import type { Fibers } from "src/stores/fibers";

  import { moveFiber, renderFiber, scaleFiber } from "src/stores/fibers";
  import { focusArea$, changeRatio } from "src/stores/focusArea";

  import { makeElementRatio$ } from "src/reactiveUtils";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;
  const pixelRatio = window.devicePixelRatio;
  $: ctx = canvas?.getContext("2d");

  export let scale: number;
  export let offsetX: number;
  export let offsetY: number;

  let width: number;
  let height: number;

  const allFibers$ = new Subject<Fibers>();

  $: allFibers$.next(
    getFibers(
      $focusArea$.coordinates.x,
      $focusArea$.coordinates.y,
      $focusArea$.width,
      $focusArea$.height
    )
  );

  onMount(() => {
    canvas.getContext("2d").scale(pixelRatio, pixelRatio);
  });

  onMount(() => {
    const subscription = makeElementRatio$(canvas).subscribe(changeRatio);

    return () => subscription.unsubscribe();
  });

  $: data$ = merge(
    fibers$,
    allFibers$.pipe(
      tap(() => {
        ctx?.clearRect(0, 0, canvas.width, canvas.height);
      })
    )
  ).pipe(
    map((fibers) => {
      return fibers.map((f) =>
        scaleFiber(moveFiber(f, -offsetX, -offsetY), 1 / scale)
      );
    })
  );

  $: $data$.forEach((f) => {
    renderFiber(ctx, f);
  });
</script>

<svelte:window bind:innerWidth={width} bind:innerHeight={height} />
<canvas
  bind:this={canvas}
  class="canvas"
  width={width * pixelRatio}
  height={height * pixelRatio}
/>

<style scoped>
  .canvas {
    background: var(--color-background);
    cursor: none;
  }
</style>
