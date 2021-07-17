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
    color: var(--color-light);

    padding: 15px 40px;
    font-size: var(--font-size-small);
    transition: box-shadow var(--animation-fast);
    outline: none;
  }

  .button.primary:hover,
  .button.primary:focus {
    box-shadow: var(--shadow-focused) var(--color-primary);
  }

  .button.secondary:hover,
  .button.secondary:focus {
    box-shadow: var(--shadow-focused) var(--color-secondary);
  }

  .primary {
    background: var(--color-primary);
    box-shadow: var(--shadow-default) rgba(var(--color-primary), 0.3);
  }

  .secondary {
    background: var(--color-secondary);
    box-shadow: var(--shadow-default) rgba(var(--color-secondary), 0.3);
  }
</style>
