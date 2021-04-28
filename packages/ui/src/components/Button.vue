<template>
  <button class="button" :class="{ [intent]: true, [classs]: true }">
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: ["intent", "classs"],
});
</script>

<style scoped>
.button {
  border-radius: 30px;
  border: 0;
  color: #fff;

  padding: 15px 40px;
  font-family: Quicksand;
  font-size: 16px;
}

.primary {
  background: var(--primary-color);
  box-shadow: -15px 20px 40px rgba(253, 52, 110, 0.301961);
}

.secondary {
  background: var(--secondary-color);
  box-shadow: -15px 20px 40px rgba(96, 1, 211, 0.301961);
}
</style>
