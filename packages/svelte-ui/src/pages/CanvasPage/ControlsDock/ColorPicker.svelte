<script lang="ts">
  import { COLORS, BACKGROUND_COLOR } from "src/constants";
  import { createEventDispatcher } from "svelte";

  export let value: string;

  const dispatch = createEventDispatcher();
</script>

<div class="colors">
  {#each COLORS as color}
    <div
      class="color-wrapper"
      class:active={color === value}
      on:click={() => dispatch("change", color)}
    >
      <div
        class:active={color === value}
        class:outlined={color === BACKGROUND_COLOR}
        class="color"
        style="background: {color}"
      />
    </div>
  {/each}
</div>

<style>
  .colors {
    display: flex;

    align-items: center;
    justify-content: space-around;

    padding: var(--control-padding) calc(var(--control-padding) / 2);
    cursor: pointer;
  }

  .color-wrapper {
    padding: calc(var(--control-padding) / 2);
  }

  .color {
    width: 36px;
    height: 36px;
    border-radius: 50%;
  }

  .color.outlined {
    box-shadow: inset 0 0 0 1px #a7a0a8;
  }

  .color-wrapper:not(.active):hover {
    opacity: 0.6;
  }

  .color.active {
    box-shadow: 0 0 0 2px #2a192d, 0 0 0 4px #a7a0a8;
  }
</style>
