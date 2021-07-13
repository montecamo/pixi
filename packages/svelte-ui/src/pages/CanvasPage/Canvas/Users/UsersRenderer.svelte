<script lang="ts">
  import { users$, makeUser } from "src/stores/users";

  export let scale: number;
  export let offsetX: number;
  export let offsetY: number;

  $: mappedUsers$ = users$.map((users) => {
    return users.map((u) =>
      makeUser(u.id, {
        left: (u.position.left - offsetX) * scale,
        top: (u.position.top - offsetY) * scale,
      })
    );
  });
</script>

{#each $mappedUsers$ as user}
  <div
    class="user"
    style="
      left: {user.position.left}px;
      top: {user.position.top}px;
    "
  />
{/each}

<style>
  .user {
    position: absolute;

    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: lightcoral;
  }
</style>
