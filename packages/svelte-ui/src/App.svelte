<script lang="ts">
  import { setContext } from "svelte";
  import { makeApi } from "./api";
  import CanvasPage from "./pages/CanvasPage";
  import HomePage from "./pages/HomePage";

  import { Router, Route } from "svelte-routing";

  setContext("api", makeApi());
  export let url = "";
</script>

<Router {url}>
  <Route path="/:roomId" let:params>
    <CanvasPage roomId={params.roomId} />
  </Route>
  <Route path="/">
    <HomePage />
  </Route>
</Router>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap");

  @import "./variables.css";

  :global(#root) {
    height: 100%;
  }

  :global(html *) {
    font-family: var(--font-family-primary);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  :global(html),
  :global(body) {
    margin: 0;
    height: 100%;
    overflow: hidden;
  }
</style>
