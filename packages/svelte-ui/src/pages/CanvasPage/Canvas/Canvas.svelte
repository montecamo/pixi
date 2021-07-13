<script lang="ts">
  import UsersProvider from "./Users/UsersProvider.svelte";
  import UsersRenderer from "./Users/UsersRenderer.svelte";
  import FibersProvider from "./Fibers/FibersProvider.svelte";
  import FibersRenderer from "./Fibers/FibersRenderer.svelte";

  import { focusArea$ } from "src/stores/focusArea";

  let width: number;

  $: scale$ = focusArea$.map((area) => width / area.width);
  $: offsetX$ = focusArea$.map((area) => area.coordinates.x);
  $: offsetY$ = focusArea$.map((area) => area.coordinates.y);
</script>

<UsersRenderer offsetX={$offsetX$} offsetY={$offsetY$} scale={$scale$} />
<UsersProvider offsetX={$offsetX$} offsetY={$offsetY$} scale={$scale$} />
<FibersRenderer offsetX={$offsetX$} offsetY={$offsetY$} scale={$scale$} />
<FibersProvider offsetX={$offsetX$} offsetY={$offsetY$} scale={$scale$} />

<svelte:window bind:innerWidth={width} />
