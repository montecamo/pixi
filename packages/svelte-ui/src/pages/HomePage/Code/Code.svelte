<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import range from "lodash-es/range";

  import Cell from "./Cell.svelte";

  export let length: number;
  export let value: string;

  let values = [];
  let current = 0;
  const cells = [];

  const dispatch = createEventDispatcher();

  $: value = values.join("");

  const handleChange = () => {
    const next = current + 1;

    if (next < length) {
      cells[next].focus();
    } else {
      cells[current].blur();
      dispatch("ready");
    }
  };
</script>

<div class="cells">
  {#each range(length) as index}
    <div class="cell-wrapper">
      <Cell
        on:focus={() => {
          current = index;
        }}
        bind:value={values[index]}
        bind:this={cells[index]}
        on:change={handleChange}
      />
    </div>
  {/each}
</div>

<style>
  .cells {
    display: flex;
  }

  .cell-wrapper {
    margin-right: 12px;
  }
</style>
