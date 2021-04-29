<template>
  <div class="control" @wheel.prevent="handleWheel">
    <div class="title">{{ title }}</div>
    <div class="value">{{ value }}</div>
    <input
      class="slider"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      :value="value"
      @input="$emit('update', $event.target.value)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import clamp from "lodash-es/clamp";

export default defineComponent({
  props: ["min", "max", "step", "value", "title"],
  emits: ["update"],
  setup(props, { emit }) {
    const { value, max, min, step } = toRefs(props);

    const handleWheel = (e: WheelEvent) => {
      const newValue = Math.round(
        clamp(value.value - e.deltaY * step.value, min.value, max.value)
      );

      emit("update", newValue);
    };

    return { handleWheel };
  },
});
</script>

<style scoped>
.control {
  flex: 1;
  display: flex;
  flex-direction: column;

  align-items: flex-start;

  padding: 8px;
  height: 60px;
  border-top: 1px solid var(--background-color-grey);
  cursor: pointer;
}

.control:hover {
  background: rgba(243, 244, 246, 0.1);
}

.title,
.value {
  line-height: 21px;
  font-size: 14px;
  font-family: Nunito, sans-serif;
  color: #fff;
}

.title {
  font-weight: bold;
}

.value {
  color: var(--grey-color);
}

.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 4px;
  background: var(--background-color-grey);
  outline: none;
  margin-top: auto;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  background: var(--grey-color);
  border-radius: 4px;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border-radius: 4px;
  background: var(--grey-color);
  cursor: pointer;
}
</style>
