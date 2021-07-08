<script lang="ts">
  import Cell from "./Cell.svelte";
  import range from "lodash-es/range";

  export let length;
  export let value;

  let values = [];
  let current = 0;
  const cells = [];

  $: value = values.join("");

  const handleChange = () => {
    const next = (current + 1) % length;

    if (values[next] === undefined || values[next] === "") {
      cells[next].focus();
    } else {
      cells[current].blur();
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
