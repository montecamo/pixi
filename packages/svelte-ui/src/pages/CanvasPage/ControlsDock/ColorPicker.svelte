<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let value: string;

  const dispatch = createEventDispatcher();

  const COLORS = [
    "#FCDC00",
    "#0CD68A",
    "#FF895B",
    "#0F89FF",
    "#6001D3",
    "#FD346E",
  ];
</script>

<div class="colors">
  {#each COLORS as color}
    <div
      class="color"
      class:active={color === value}
      on:click={() => dispatch("change", color)}
      style="background: {color}"
    />
  {/each}
</div>

<style>
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
