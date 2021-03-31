<template>
  <div
    v-for="u in users"
    class="user"
    :key="u.id"
    :style="{
      left: `${u.position.left}px`,
      top: `${u.position.top}px`,
    }"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: ["users"],
});
</script>

<style scoped>
.user {
  position: fixed;

  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: lightcoral;
}
</style>
