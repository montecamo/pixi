<script lang="ts">
  import { brush$ } from "src/stores/brush";

  export let scale: number = 1;
</script>

<div
  class="brush"
  style="
    background-color: {$brush$.color};
    width: {$brush$.size * scale}px;
    height: {$brush$.size * scale}px;
    left: {$brush$.coordinates.x}px;
    top: {$brush$.coordinates.y}px;
  "
/>

<style scoped>
  .brush {
    border-radius: 50%;
    position: absolute;

    transform: translate(-50%, -50%);
  }
</style>
