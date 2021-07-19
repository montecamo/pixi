<script lang="ts">
  import { concat, fromEvent, NEVER, of } from "rxjs";
  import {
    map,
    withLatestFrom,
    takeUntil,
    switchMap,
    scan,
    tap,
  } from "rxjs/operators";
  import { onMount } from "svelte";

  import {
    renderFiber,
    makeFiber,
    makeFibersCoordinates,
  } from "src/stores/fibers";
  import { brushObservable$ } from "src/stores/brush";

  import { makeMouseVector } from "src/reactiveUtils";

  let width: number;
  let height: number;
  export let container: HTMLElement;
  export let scale: number;
  let canvas: HTMLCanvasElement;

  const pixelRatio = window.devicePixelRatio;
  $: ctx = canvas?.getContext("2d");

  $: down$ = container ? fromEvent(container, "mousedown") : NEVER;
  $: move$ = container ? fromEvent(container, "mousemove") : NEVER;
  $: up$ = container ? fromEvent(container, "mouseup") : NEVER;

  $: fiber$ = down$.pipe(
    switchMap((e) => {
      const vectors$ = concat(of(e), move$).pipe(
        takeUntil(up$),
        map(makeMouseVector)
      );

      return vectors$.pipe(
        scan((acc, value) => acc.concat(value), []),
        withLatestFrom(brushObservable$),
        map(([vectors, { color, size, opacity }]) => {
          return makeFiber(
            vectors.map(({ fromX, fromY, toX, toY }) =>
              makeFibersCoordinates(fromX, fromY, toX, toY)
            ),
            color,
            size * scale,
            opacity
          );
        })
      );
    })
  );

  $: {
    ctx?.clearRect(0, 0, canvas.width, canvas.height);
    $up$;
    $fiber$;
  }

  onMount(() => {
    canvas.getContext("2d").scale(pixelRatio, pixelRatio);
  });

  $: {
    if ($fiber$) {
      renderFiber(ctx, $fiber$);
    }
  }
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
    background: transparent;
    pointer-events: none;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>
