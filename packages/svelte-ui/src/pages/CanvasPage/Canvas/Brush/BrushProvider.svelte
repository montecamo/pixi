<script lang="ts">
  import { of } from "rxjs";
  import { updateBrushCoordinates } from "src/stores/brush";
  import { makeMouseMoveCoordinates$ } from "src/reactiveUtils";

  export let container: HTMLElement;

  $: coordinates$ = container
    ? makeMouseMoveCoordinates$(container)
    : of({ x: 0, y: 0 });

  $: updateBrushCoordinates($coordinates$);
</script>

<style>
</style>
