<script lang="ts">
  import { getContext } from "svelte";
  import type { Writable } from "svelte/store";
  import Control from "src/components/Control.svelte";
  import ColorPicker from "./ColorPicker.svelte";

  const color: Writable<string> = getContext("brushColor");
  const updateColor: (color: string) => void = getContext("updateBrushColor");

  const size: Writable<number> = getContext("brushSize");
  const updateSize: (value: number) => void = getContext("updateBrushSize");
</script>

<div class="container">
  <Control
    title="SIZE"
    min={0}
    max={48}
    step={1}
    on:change={(e) => updateSize(e.detail)}
    value={$size}
  />
  <div class="spacer" />
  <ColorPicker on:change={(e) => updateColor(e.detail)} value={$color} />
</div>

<style>
  .container {
    position: absolute;
    bottom: 0;
    right: 0;
    left: 0;

    display: flex;

    --control-padding: 8px;
    --control-height: 60px;
    --control-border: 1px solid var(--background-color-grey);
    --control-hover-background: rgba(243, 244, 246, 0.1);
  }

  .spacer {
    max-width: 1px;
    flex: 1;
    background: var(--background-color-grey);
  }
</style>
