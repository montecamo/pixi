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
    e.preventDefault();
    const delta = e.deltaY * 0.5;

    const newValue = Math.round(clamp(value - delta * step, min, max));

    dispatch("change", newValue);
  };
</script>

<div class="wrapper">
  <div class="control" on:wheel|preventDefault={handleWheel}>
    <div class="title">{title}</div>
    <div class="value">{value}</div>
    <input
      class="slider"
      type="range"
      {min}
      {max}
      {step}
      {value}
      on:input={(e) => dispatch("change", e.target.value)}
    />
    <div class="slider-line" />
  </div>
</div>

<style>
  .wrapper {
    padding: 0 var(--control-padding);
    display: flex;
    flex-grow: 1;
  }
  .wrapper:hover {
    background: var(--control-hover-background);
  }

  .control {
    --slider-thumb-size: 12px;
    --slider-line-height: 4px;
    padding: var(--control-padding) 0;
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    position: relative;

    align-items: flex-start;
  }

  .title,
  .value {
    line-height: 21px;
    font-size: var(--font-size-x-small);
    font-family: var(--font-family-secondary);
    color: var(--color-light);
  }

  .title {
    font-weight: bold;
  }

  .value {
    color: var(--color-grey);
  }

  .slider {
    -webkit-appearance: none;
    margin: 0;
    cursor: pointer;
    outline: none;
    background: transparent;
    position: absolute;

    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }

  .slider-line {
    margin-top: auto;
    background: var(--color-background-grey);
    height: var(--slider-line-height);
    width: 100%;
  }

  .slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    transform: translateY(
      calc(
        var(--control-height) / 2 - var(--slider-thumb-size) / 2 -
          var(--slider-line-height)
      )
    );
    appearance: none;
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    background: var(--color-primary);
    border-radius: 4px;
    cursor: pointer;
  }

  .slider::-moz-range-thumb {
    appearance: none;
    transform: translateY(
      calc(
        var(--control-height) / 2 - var(--slider-thumb-size) / 2 -
          var(--slider-line-height)
      )
    );
    width: var(--slider-thumb-size);
    height: var(--slider-thumb-size);
    background: var(--color-primary);
    border-radius: 4px;
    cursor: pointer;
  }
</style>
