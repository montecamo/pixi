<script lang="ts">
  import Control from "src/components/Control.svelte";
  import ColorPicker from "./ColorPicker.svelte";
  import { brush$, updateBrushColor, updateBrushSize } from "src/stores/brush";
</script>

<div class="container" on:mousemove|stopPropagation>
  <Control
    title="SIZE"
    min={0}
    max={48}
    step={1}
    on:change={(e) => updateBrushSize(e.detail)}
    value={$brush$.size}
  />
  <div class="spacer" />
  <ColorPicker
    on:change={(e) => updateBrushColor(e.detail)}
    value={$brush$.color}
  />
</div>

<style>
  .container {
    --control-padding: 8px;
    --control-height: 80px;
    --control-border: 1px solid var(--color-background-grey);
    --control-hover-background: rgba(243, 244, 246, 0.1);

    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;

    display: flex;

    max-height: var(--control-height);
    border-top: var(--control-border);
    height: 100%;
  }

  .spacer {
    max-width: 1px;
    flex: 1;
    background: var(--color-background-grey);
  }
</style>
