<template>
  <div class="container">
    <Control
      title="SIZE"
      min="0"
      max="48"
      step="1"
      @update="updateSize"
      :value="size"
    />
    <div class="spacer"></div>
    <Control
      title="SIZE"
      min="0"
      max="48"
      step="1"
      @update="updateSize"
      :value="size"
    />
    <div class="spacer"></div>
    <Control
      title="SIZE"
      min="0"
      max="48"
      step="1"
      @update="updateSize"
      :value="size"
    />
    <div class="spacer"></div>
    <ColorPicker @update="updateColor" :value="color" />
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
import Control from "./Control.vue";
import ColorPicker from "./ColorPicker.vue";

export default defineComponent({
  components: { Control, ColorPicker },
  emits: ["update:color", "update:size"],
  setup() {
    const color = inject("brushColor");
    const updateColor = inject("updateBrushColor");

    const size = inject("brushSize");
    const updateSize = inject("updateBrushSize");

    return { color, size, updateColor, updateSize };
  },
});
</script>

<style scoped>
.container {
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;

  display: flex;
}

.spacer {
  max-width: 1px;
  flex: 1;
  background: var(--background-color-grey);
}
</style>
