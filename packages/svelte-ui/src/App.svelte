<script lang="ts">
  import { setContext } from "svelte";
  import { makeApi } from "./api";
  import CanvasPage from "./pages/CanvasPage";
  import HomePage from "./pages/HomePage.svelte";

  import { Router, Route } from "svelte-routing";

  setContext("api", makeApi());
  export let url = "";
</script>

<Router {url}>
  <Route path="/:roomId" component={CanvasPage} />
  <Route path="/">
    <HomePage />
  </Route>
</Router>

<style>
  @import url("https://fonts.googleapis.com/css2?family=Nunito:wght@400;700&display=swap");
  @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@400;700&display=swap");

  @import "./variables.css";

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
