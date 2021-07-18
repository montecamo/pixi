<script lang="ts">
  import { brush$ } from "src/stores/brush";
  import { BACKGROUND_COLOR } from "src/constants";

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
    box-shadow: inset 0 0 0 2px #a7a0a8;
  }
</style>
