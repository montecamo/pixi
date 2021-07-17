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

    background: var(--color-background-grey);
    border-radius: 20px;
    border: 0;

    color: white;
    font-size: var(--font-size-large);
    font-family: var(--font-family-secondary);
    text-align: center;
    outline: none;
    caret-color: transparent;

    transition: box-shadow var(--animation-fast);
  }

  .cell:focus {
    box-shadow: 0 0 4px 2px var(--color-secondary);
  }
</style>
