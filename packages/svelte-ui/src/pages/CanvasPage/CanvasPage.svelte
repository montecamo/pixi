<script lang="ts">
  import { getContext } from "svelte";
  import Canvas from "./Canvas";
  import Map from "./Map/Map.svelte";
  import { Dock } from "./ControlsDock";

  import type { Api } from "src/api";

  const api = getContext<Api>("api");
  export let roomId: string;

  api.joinRoom(roomId);
</script>

<Canvas />
<Map />
<Dock />
