<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { Observable, Subject, merge, Subscription } from "rxjs";
  import { withLatestFrom, map, tap, filter } from "rxjs/operators";
  import { fibers$, getFibers } from "src/stores/fibers/fibers";
  import type { Fibers } from "src/stores/fibers";
  import { brushObservable$ } from "src/stores/brush";
  import type { Api } from "src/api";
  import Users from "./Users.svelte";
  import { makeUser } from "src/stores/users";

  import {
    makeFiber,
    addFibers,
    moveFiber,
    scaleFiber,
    scaleFiberCoordinates,
    renderFiber,
  } from "src/stores/fibers";
  import {
    focusAreaObservable$,
    focusArea$,
    changeRatio,
  } from "src/stores/focusArea";

  import {
    makeMousePressedMoveVector$,
    makeMouseMoveCoordinates$,
  } from "src/reactiveUtils";
  import { makeElementRatio$ } from "src/reactiveUtils";

  export let canvas: HTMLCanvasElement = null;

  let width: number;
  let height: number;

  const api = getContext<Api>("api");
  const scale$ = focusAreaObservable$.pipe(
    filter(() => Boolean(canvas)),
    map(({ width }) => {
      return canvas.width / width;
    })
  );

  onMount(() => {
    const subscription = new Subscription();
    const moveVector$ = makeMousePressedMoveVector$(canvas);

    const localFibers$: Observable<Fibers> = moveVector$.pipe(
      withLatestFrom(brushObservable$),
      map(([{ fromX, fromY, toX, toY }, { color, size }]) => {
        return [makeFiber(fromX, fromY, toX, toY, color, size)];
      }),
      withLatestFrom(scale$, focusArea$),
      map(([fibers, scale, { coordinates }]) =>
        fibers.map((f) =>
          moveFiber(
            scaleFiberCoordinates(f, scale),
            coordinates.x,
            coordinates.y
          )
        )
      )
    );

    subscription.add(localFibers$.subscribe(addFibers));
    subscription.add(
      localFibers$.subscribe((fibers) => {
        api.draw(fibers);
      })
    );

    return () => subscription.unsubscribe();
  });

  onMount(() => {
    const coordinates$ = makeMouseMoveCoordinates$(canvas);

    const subscription = coordinates$
      .pipe(withLatestFrom(focusAreaObservable$, scale$))
      .subscribe(([pos, { coordinates }, scale]) => {
        api.updateUser(
          makeUser("", {
            left: pos.x / scale + coordinates.x,
            top: pos.y / scale + coordinates.y,
          })
        );
      });

    return () => subscription.unsubscribe();
  });

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

<Users scale={$scale$} />
<svelte:window bind:innerHeight={height} bind:innerWidth={width} />

<canvas bind:this={canvas} class="canvas" {width} {height} />

<style scoped>
  .canvas {
    background: var(--background-color);
  }
</style>
