<script lang="ts">
  import { getContext } from "svelte";
  import Canvas from "./Canvas.svelte";
  import ReferenceCanvas from "./ReferenceCanvas.svelte";
  import { Dock } from "./ControlsDock";

  import { addFibers } from "src/stores/fibers/fibers";
  import type { Api } from "src/api";
  import { focusArea$ } from "src/stores/focusArea";

  const CANVAS_SIZE = 2000;

  let canvas: HTMLCanvasElement;
  let referenceCanvas: HTMLCanvasElement;

  const api = getContext<Api>("api");
  export let roomId: string;

  api.fibers$.subscribe(addFibers);

  api.joinRoom(roomId);
</script>

<Canvas bind:canvas />
<ReferenceCanvas
  width={CANVAS_SIZE}
  height={CANVAS_SIZE}
  focusArea={$focusArea$}
  bind:referenceCanvas
/>
<Dock />

<style>
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap");

  @import "../../variables.css";

  :global(#root) {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    height: 100%;
  }

  :global(html),
  :global(body) {
    margin: 0;
    height: 100%;
  }
</style>
