<template>
  <div class="colors">
    <div
      v-for="color in colors"
      :key="color"
      class="color"
      :class="{ active: color === value }"
      @click="$emit('update', color)"
      :style="{ background: color }"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["value"],
  emits: ["update"],
  setup() {
    return {
      colors: [
        "#FCDC00",
        "#0CD68A",
        "#FF895B",
        "#0F89FF",
        "#6001D3",
        "#FD346E",
      ],
    };
  },
});
</script>

<style scoped>
.colors {
  display: flex;

  align-items: center;
  justify-content: space-around;

  padding: var(--control-padding) calc(var(--control-padding) / 2);
  height: var(--control-height);
  border-top: var(--control-border);
  cursor: pointer;
}

.color {
  margin: 0 calc(var(--control-padding) / 2);

  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.color:not(.active):hover {
  opacity: 0.6;
}

.color.active {
  box-shadow: 0 0 0 2px #2a192d, 0 0 0 4px #a7a0a8;
}
</style>
