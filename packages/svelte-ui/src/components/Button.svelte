<script lang="ts">
  import { createEventDispatcher } from "svelte";

  export let intent: string;
  export let clazz: string = "";
  export { clazz as class };

  const dispatch = createEventDispatcher();

  const handleClick = () => dispatch("click");
</script>

<button on:click={handleClick} class={`button ${intent} ${clazz}`}>
  <slot />
</button>

<style scoped>
  .button {
    border-radius: 30px;
    border: 0;
    color: #fff;

    padding: 15px 40px;
    font-family: Quicksand;
    font-size: 16px;
  }

  .primary {
    background: var(--primary-color);
    box-shadow: -15px 20px 40px rgba(253, 52, 110, 0.301961);
  }

  .secondary {
    background: var(--secondary-color);
    box-shadow: -15px 20px 40px rgba(96, 1, 211, 0.301961);
  }
</style>
