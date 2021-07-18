<script lang="ts">
  import { brush$ } from "src/stores/brush";
  import { scaleFiberCoordinates } from "src/stores/fibers";

  export let scale: number = 1;
</script>

{#if $brush$.coordinates.x > 0 && $brush$.coordinates.y > 0}
  <div
    class="brush-wrapper"
    style="
    width: {$brush$.size * scale - 4}px;
    height: {$brush$.size * scale - 4}px;
    left: {$brush$.coordinates.x}px;
    top: {$brush$.coordinates.y}px;
  "
  >
    <div
      class="brush"
      style="
      background-color: {$brush$.color};
      opacity: {$brush$.opacity / 100};
    "
    />
  </div>
{/if}

<style scoped>
  .brush-wrapper {
    position: absolute;

    transform: translate(-50%, -50%);
    border: 2px solid #a7a0a8;
    border-radius: 50%;
    overflow: hidden;
  }

  .brush {
    width: 100%;
    height: 100%;
  }
</style>
