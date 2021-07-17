<script>
  import { createEventDispatcher } from "svelte";
  import { ROOM_CODE_REGEX } from "src/constants";

  export let value = "";
  const dispatch = createEventDispatcher();

  let input;

  function handleKeyDown(e) {
    if (e.key === "Backspace") {
      value = "";
    }
  }

  function handleInput(e) {
    const key = e.data ?? "";

    if (!ROOM_CODE_REGEX.test(key)) {
      input.value = input.value.replace(key, "");
      return;
    }

    value = key.toUpperCase();
    input.value = value;
    dispatch("change");
  }

  export function focus() {
    input.focus();
  }

  export function blur() {
    input.blur();
  }
</script>

<input
  on:keydown={handleKeyDown}
  on:input={handleInput}
  on:focus={() => dispatch("focus")}
  {value}
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
    caret-color: transparent;

    transition: box-shadow 150ms;
  }

  .cell:focus {
    box-shadow: 0 0 4px 2px var(--secondary-color);
  }
</style>
