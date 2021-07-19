<script lang="ts">
  import { getContext } from "svelte";
  import type { Api } from "src/api";
  import { NEVER } from "rxjs";
  import { withLatestFrom, map, startWith } from "rxjs/operators";
  import { addFibers, makeFibersCoordinates } from "src/stores/fibers";
  import { brushObservable$ } from "src/stores/brush";

  const api = getContext<Api>("api");
  export let container: HTMLElement;

  import {
    makeFiber,
    moveFiber,
    scaleFiberCoordinates,
  } from "src/stores/fibers";

  import { makeMousePressedMoveVectors$ } from "src/reactiveUtils";

  export let scale: number;
  export let offsetX: number;
  export let offsetY: number;
  $: moveVectors$ = container ? makeMousePressedMoveVectors$(container) : NEVER;
  const apiFibers$ = api.fibers$.pipe(startWith([]));

  $: fibers$ = moveVectors$.pipe(
    withLatestFrom(brushObservable$),
    map(([vectors, { color, size, opacity }]) => {
      return [
        makeFiber(
          vectors.map(({ fromX, fromY, toX, toY }) =>
            makeFibersCoordinates(fromX, fromY, toX, toY)
          ),
          color,
          size,
          opacity
        ),
      ];
    }),
    map((fibers) =>
      fibers.map((f) =>
        moveFiber(scaleFiberCoordinates(f, scale), offsetX, offsetY)
      )
    ),
    startWith([])
  );

  $: addFibers($fibers$);
  $: api.draw($fibers$);
  $: addFibers($apiFibers$);
</script>
