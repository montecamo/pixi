<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let intent: string;
  export let clazz: string = "";
  export { clazz as class };

  let button: HTMLButtonElement;

  export function focus() {
    button.focus();
  }

  const dispatch = createEventDispatcher();

  const handleClick = () => dispatch("click");
</script>

<button
  bind:this={button}
  on:click={handleClick}
  class={`button ${intent} ${clazz}`}
>
  <slot />
</button>

<style scoped>
  .button {
    cursor: pointer;
    border-radius: 30px;
    border: 0;
    color: #fff;

    padding: 15px 40px;
    font-family: Quicksand;
    font-size: 16px;
    transition: box-shadow 150ms;
    outline: none;
  }

  .button.primary:hover,
  .button.primary:focus {
    box-shadow: 0 0 4px 2px var(--primary-color);
  }

  .button.secondary:hover,
  .button.secondary:focus {
    box-shadow: 0 0 4px 1px var(--secondary-color);
  }

  .primary {
    background: var(--primary-color);
    box-shadow: -15px 20px 40px rgba(253, 52, 110, 0.3);
  }

  .secondary {
    background: var(--secondary-color);
    box-shadow: -15px 20px 40px rgba(96, 1, 211, 0.3);
  }
</style>
