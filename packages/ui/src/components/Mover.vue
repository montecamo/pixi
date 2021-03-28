<template>
  <div class="wrapper">
    <div
      :style="{ width: `${containerWidth}px`, height: `${containerHeight}px` }"
      class="container"
      @mousedown="down$"
      @mousemove="move$"
      @wheel.prevent="handleWheel"
    >
      <div
        :style="{
          left: `${pos.left - 1}px`,
          top: `${pos.top - 1}px`,
          width: `${innerWidth}px`,
          height: `${innerHeight}px`,
        }"
        class="inner"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
const SIZE_RATIO = 5;

import { ref, toRefs, watch, computed, defineComponent } from "vue";
import { concat, of, fromEvent, Subject } from "rxjs";
import { switchMap, takeUntil, map, filter } from "rxjs/operators";

const cut = (start: number, end: number, value: number) => {
  if (value < start) return start;
  if (value > end) return end;

  return value;
};

function stream<T>(subject: Subject<T>): (e: T) => void {
  return (e) => {
    subject.next(e);
  };
}

export default defineComponent({
  props: ["position", "zoom", "canvasWidth", "canvasHeight"],
  emits: ["update:position", "update:zoom"],
  setup(props, { emit }) {
    const { position, zoom, canvasWidth, canvasHeight } = toRefs(props);

    const containerWidth = computed(() => canvasWidth.value / SIZE_RATIO);
    const containerHeight = computed(() => canvasHeight.value / SIZE_RATIO);

    const innerWidth = computed(
      () => (containerWidth.value * zoom.value) / 100
    );
    const innerHeight = computed(
      () => (containerHeight.value * zoom.value) / 100
    );

    const pos = computed(() => ({
      left: cut(
        0,
        containerWidth.value - innerWidth.value,
        position.value.left
      ),
      top: cut(
        0,
        containerHeight.value - innerHeight.value,
        position.value.top
      ),
    }));

    const down$ = new Subject<MouseEvent>();
    const up$ = fromEvent<MouseEvent>(document, "mouseup");
    const move$ = new Subject<MouseEvent>();
    const handleWheel = (e: WheelEvent) => {
      emit("update:zoom", cut(0, 100, zoom.value + e.deltaY));
    };

    down$
      .pipe(
        switchMap((e) => {
          return concat(of(e), move$).pipe(
            takeUntil(up$),
            map(({ offsetX, offsetY }) => [
              offsetX - innerWidth.value / 2,
              offsetY - innerHeight.value / 2,
            ]),
            map(([offsetX, offsetY]) => [
              cut(0, containerWidth.value - innerWidth.value, offsetX),
              cut(0, containerHeight.value - innerHeight.value, offsetY),
            ])
          );
        })
      )
      .subscribe(([left, top]) => {
        emit("update:position", { left, top });
      });

    return {
      containerWidth,
      containerHeight,
      innerWidth,
      innerHeight,
      down$: stream(down$),
      move$: stream(move$),
      handleWheel,
      pos,
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
