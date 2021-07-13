<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { combineLatest } from "rxjs";
  import { map, startWith } from "rxjs/operators";

  import { users$, deleteUser, addUser, makeUser } from "src/stores/users";
  import { focusAreaObservable$ } from "src/stores/focusArea";
  import type { Api } from "src/api";

  export let scale: number;

  const api = getContext<Api>("api")!;

  const mappedUsers$ = combineLatest([users$, focusAreaObservable$]).pipe(
    map(([serverUsers, { coordinates }]) => {
      return serverUsers.map((u) =>
        makeUser(u.id, {
          left: (u.position.left - coordinates.x) * scale,
          top: (u.position.top - coordinates.y) * scale,
        })
      );
    }),
    startWith([])
  );

  onMount(() => {
    api.usersDisconnected$.subscribe((id) => {
      deleteUser(id);
    });

    api.users$.subscribe((user) => {
      deleteUser(user.id);
      addUser(user);
    });
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
    position: fixed;

    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: lightcoral;
  }
</style>
