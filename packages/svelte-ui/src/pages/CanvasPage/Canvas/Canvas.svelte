<script lang="ts">
  import UsersProvider from "./Users/UsersProvider.svelte";
  import UsersRenderer from "./Users/UsersRenderer.svelte";
  import FibersProvider from "./Fibers/FibersProvider.svelte";
  import FibersRenderer from "./Fibers/FibersRenderer.svelte";
  import BrushProvider from "./Brush/BrushProvider.svelte";
  import BrushRenderer from "./Brush/BrushRenderer.svelte";

  import { focusArea$ } from "src/stores/focusArea";

  let width: number;
  let container;

  $: scale$ = focusArea$.map((area) => width / area.width);
  $: offsetX$ = focusArea$.map((area) => area.coordinates.x);
  $: offsetY$ = focusArea$.map((area) => area.coordinates.y);
</script>

<UsersRenderer offsetX={$offsetX$} offsetY={$offsetY$} scale={$scale$} />
<UsersProvider
  {container}
  offsetX={$offsetX$}
  offsetY={$offsetY$}
  scale={$scale$}
/>
<FibersRenderer offsetX={$offsetX$} offsetY={$offsetY$} scale={$scale$} />
<FibersProvider
  {container}
  offsetX={$offsetX$}
  offsetY={$offsetY$}
  scale={$scale$}
/>
<BrushProvider {container} />
<BrushRenderer scale={$scale$} />

<svelte:window bind:innerWidth={width} />

<div class="container" bind:this={container} />

<style>
  .container {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    cursor: none;
  }
</style>
