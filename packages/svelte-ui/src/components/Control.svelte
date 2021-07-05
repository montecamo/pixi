<script lang="ts">
  import clamp from "lodash-es/clamp";
  import { createEventDispatcher } from "svelte";

  export let min = 0;
  export let max = 100;
  export let step = 1;
  export let value = 0;
  export let title: string;

  const dispatch = createEventDispatcher();

  const handleWheel = (e: WheelEvent) => {
    const newValue = Math.round(clamp(value - e.deltaY * step, min, max));

    dispatch("change", newValue);
  };
</script>

<div class="control" on:wheel|preventDefault={handleWheel}>
  <div class="title">{title}</div>
  <div class="value">{value}</div>
  <input class="slider" type="range" {min} {max} {step} {value} />
</div>

<style>
  .control {
    flex: 1;
    display: flex;
    flex-direction: column;

    align-items: flex-start;

    padding: var(--control-padding);
    height: var(--control-height);
    border-top: var(--control-border);
    cursor: pointer;
  }

  .control:hover {
    background: var(--control-hover-background);
  }

  .title,
  .value {
    line-height: 21px;
    font-size: 14px;
    font-family: Nunito, sans-serif;
    color: #fff;
  }

  .title {
    font-weight: bold;
  }

  .value {
    color: var(--grey-color);
  }

  .slider {
    -webkit-appearance: none;
    width: 100%;
    height: 4px;
    background: var(--background-color-grey);
    outline: none;
    margin-top: auto;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 12px;
    height: 12px;
    background: var(--grey-color);
    border-radius: 4px;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 4px;
    background: var(--grey-color);
    cursor: pointer;
  }
</style>
