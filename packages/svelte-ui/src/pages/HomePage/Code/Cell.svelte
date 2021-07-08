<script>
  import { createEventDispatcher } from "svelte";
  let input;
  export let value = "";

  const dispatch = createEventDispatcher();

  $: {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }

    value = value.toUpperCase();
  }

  export function focus() {
    console.warn("focus");
    input.focus();
  }

  export function blur() {
    console.warn("blur");
    input.blur();
  }
</script>

<input
  on:focus={() => dispatch("focus")}
  on:input={() => dispatch("change")}
  bind:value
  bind:this={input}
  class="cell"
/>

<style>
  .cell {
    width: 80px;
    height: 80px;

    background: #192431;
    border-radius: 20px;
    border: 0;
    font-family: Nunito, sans-serif;

    color: white;
    font-size: 40px;
    text-align: center;
    outline: none;
  }
</style>
