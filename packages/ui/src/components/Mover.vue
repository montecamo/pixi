<template>
  <div class="wrapper">
    <div
      :style="{ width: `${containerWidth}px`, height: `${containerHeight}px` }"
      class="container"
      ref="container"
    >
      <div
        :style="{
          left: `${pos.left - 1}px`,
          top: `${pos.top - 1}px`,
          width: `${pos.width}px`,
          height: `${pos.height}px`,
        }"
        class="inner"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
const SIZE_RATIO = 5;

import { ref, toRefs, watch, computed, defineComponent } from "vue";
import { concat, of, fromEvent, Subject, Observable } from "rxjs";
import { switchMap, takeUntil, map, filter, tap } from "rxjs/operators";

import {
  makeMouseOffset$,
  makeMouseZoom$,
  makeOffsetController$,
} from "../utils/offset";
import { useAsObservable, useAsRef } from "../hooks";

function stream<T>(subject: Subject<T>): (e: T) => void {
  return (e) => {
    subject.next(e);
  };
}

export default defineComponent({
  props: ["position", "zoom", "canvasWidth", "canvasHeight"],
  emits: ["update:position", "update:zoom"],
  setup(props, { emit }) {
    const count = ref(0);
    count.value = 123;

    const { position, zoom, canvasWidth, canvasHeight } = toRefs(props);
    const container = ref<HTMLElement | null>();

    const containerWidth = computed(() => canvasWidth.value / SIZE_RATIO);
    const containerHeight = computed(() => canvasHeight.value / SIZE_RATIO);

    const containerWidth$ = useAsObservable<number>(containerWidth);
    const containerHeight$ = useAsObservable<number>(containerHeight);
    const container$ = useAsObservable<HTMLElement | null | undefined>(
      container
    ).pipe(
      filter((el) => el instanceof HTMLElement),
      map((el) => el as HTMLElement)
    );

    const zoom$ = makeMouseZoom$(container$);
    const offset$ = makeMouseOffset$(container$);
    const position$ = makeOffsetController$(
      offset$,
      containerWidth$,
      containerHeight$,
      zoom$
    );

    const pos = useAsRef(position$, {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
    });

    return {
      pos,
      containerHeight,
      containerWidth,
      container,
    };
  },
});
</script>

<style scoped>
.wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.container {
  border: 1px solid lightblue;
  position: relative;
  overflow: auto;
}

.inner {
  border: 1px solid lightcoral;
  position: absolute;
  pointer-events: none;
}
</style>
