<script lang="ts">
  import { getContext } from "svelte";
  import Canvas from "./Canvas.svelte";
  import Map from "./Map.svelte";
  import { Dock } from "./ControlsDock";

  import { addFibers } from "src/stores/fibers/fibers";
  import type { Api } from "src/api";

  const api = getContext<Api>("api");
  export let roomId: string;

  api.fibers$.subscribe(addFibers);

  api.joinRoom(roomId);
</script>

<Canvas />
<Map />
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
