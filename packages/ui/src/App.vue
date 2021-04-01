<template>
  <Canvas
    :brushSize="brushSize"
    :brushColor="brushColor"
    v-model:canvas-ref="canvasRef"
  />
  <BrushSize v-model:brush-size="brushSize" />
  <BrushColor v-model:brush-color="brushColor" />
  <ReferenceCanvas
    :width="canvasWidth"
    :height="canvasHeight"
    :hole="hole"
    v-model:canvas-ref="referenceCanvasRef"
  />
  <UsersComp :users="users" />
</template>

<script lang="ts">
import Canvas from "./components/Canvas.vue";
import BrushSize from "./components/BrushSize.vue";
import BrushColor from "./components/BrushColor.vue";
import ReferenceCanvas from "./components/ReferenceCanvas.vue";
import UsersComp from "./components/Users.vue";

import { merge, Observable, combineLatest } from "rxjs";
import { withLatestFrom, filter, map } from "rxjs/operators";
import { makeApi } from "./api";
import { makeFiber, moveFiber, scaleFiber, renderFiber } from "./fibers";
import type { Fibers } from "./fibers";
import { makeUser } from "./users";
import type { Users } from "./users";

import { ref, defineComponent } from "vue";
import {
  makeHole$,
  applyCanvasHole,
  makeHoleImageData$,
  makeHoleScale$,
  makeMousePressedDelta$,
  makeMouseOffset$,
} from "./reactiveUtils";
import { notNull } from "./utils";
import { useAsObservable } from "./hooks/useAsObservable";

export default defineComponent({
  name: "App",
  components: {
    Canvas,
    BrushSize,
    BrushColor,
    ReferenceCanvas,
    UsersComp,
  },
  setup() {
    const canvasRef = ref(null);
    const referenceCanvasRef = ref(null);
    const api = makeApi();
    const users = ref<Users>([]);
    const renderUsers = ref<Users>([]);

    const brushSize = ref(2);
    const brushColor = ref("#000");
    const canvasWidth = ref(2000);
    const canvasHeight = ref(2000);
    const hole = ref({ width: 100, height: 100, left: 2, top: 2 });
    const brushColor$ = useAsObservable(brushColor);
    const brushSize$ = useAsObservable(brushSize);

    const canvas$ = useAsObservable<HTMLCanvasElement | null>(canvasRef).pipe(
      filter(notNull)
    );
    const referenceCanvas$ = useAsObservable<HTMLCanvasElement | null>(
      referenceCanvasRef
    ).pipe(filter(notNull));

    const hole$ = makeHole$(referenceCanvas$, canvas$);
    const scale$ = makeHoleScale$(canvas$, hole$);
    const holeImageData$ = makeHoleImageData$(referenceCanvas$, hole$);
    const userPosition$ = makeMouseOffset$(canvas$);

    applyCanvasHole(canvas$, scale$, holeImageData$);

    hole$.subscribe((h) => {
      hole.value = h;
    });

    userPosition$
      .pipe(withLatestFrom(hole$, scale$))
      .subscribe(([pos, { left, top }, scale]) => {
        api.updateUser(
          makeUser("", {
            left: pos.left / scale + left,
            top: pos.top / scale + top,
          })
        );
      });

    const pressedDelta$ = makeMousePressedDelta$(canvas$);

    const {
      fibers$: serverFibers$,
      users$: serverUsers$,
      usersDisconnected$,
    } = api.joinRoom(window.location.pathname.slice(1));

    serverUsers$.subscribe((user) => {
      const filtered = users.value.filter((u) => u.id !== user.id);

      filtered.push(user);

      users.value = filtered;
      renderUsers.value = filtered;
    });

    usersDisconnected$.subscribe((id) => {
      users.value = users.value.filter((u) => u.id !== id);
      renderUsers.value = renderUsers.value.filter((u) => u.id !== id);
    });

    combineLatest([hole$, scale$]).subscribe(([{ left, top }, scale]) => {
      renderUsers.value = users.value.map((u) =>
        makeUser(u.id, {
          left: u.position.left / scale - left,
          top: u.position.top / scale - top,
        })
      );
    });

    const localFibers$: Observable<Fibers> = pressedDelta$.pipe(
      withLatestFrom(brushColor$, brushSize$),
      map(([{ x, y, toX, toY }, color, size]) => {
        return [makeFiber(x, y, toX, toY, color, size)];
      }),
      withLatestFrom(scale$, hole$),
      map(([fibers, scale, { left, top }]) =>
        fibers.map((f) => moveFiber(scaleFiber(f, scale), left, top))
      )
    );

    const fibers$ = merge(serverFibers$, localFibers$);

    localFibers$.subscribe((fibers) => {
      api.draw(fibers);
    });

    fibers$
      .pipe(
        withLatestFrom(hole$),
        map(([fibers, { left, top }]) =>
          fibers.map((f) => moveFiber(f, -left, -top))
        ),
        withLatestFrom(canvas$)
      )
      .subscribe(([fibers, canvas]) => {
        const ctx = canvas.getContext("2d");

        if (ctx) {
          fibers.forEach((f) => {
            renderFiber(ctx, f);
          });
        }
      });

    fibers$
      .pipe(withLatestFrom(referenceCanvas$))
      .subscribe(([fibers, referenceCanvas]) => {
        const ctx = referenceCanvas.getContext("2d");

        if (ctx) {
          fibers.forEach((f) => {
            renderFiber(ctx, f);
          });
        }
      });

    return {
      canvasRef,
      referenceCanvasRef,
      brushColor,
      brushSize,
      hole,
      canvasWidth,
      canvasHeight,
      users: renderUsers,
    };
  },
});
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

html,
body {
  margin: 0;
  height: 100%;
}
</style>
