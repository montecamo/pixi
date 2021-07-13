<script lang="ts">
  import { getContext } from "svelte";
  import type { Api } from "src/api";
  import { withLatestFrom, map, startWith } from "rxjs/operators";
  import { addFibers } from "src/stores/fibers";
  import { brushObservable$ } from "src/stores/brush";

  const api = getContext<Api>("api");

  import {
    makeFiber,
    moveFiber,
    scaleFiberCoordinates,
  } from "src/stores/fibers";

  import { makeMousePressedMoveVector$ } from "src/reactiveUtils";

  export let scale: number;
  export let offsetX: number;
  export let offsetY: number;
  const moveVector$ = makeMousePressedMoveVector$(
    document as unknown as HTMLElement
  );
  const apiFibers$ = api.fibers$.pipe(startWith([]));

  $: fibers$ = moveVector$.pipe(
    withLatestFrom(brushObservable$),
    map(([{ fromX, fromY, toX, toY }, { color, size }]) => {
      return [makeFiber(fromX, fromY, toX, toY, color, size)];
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
