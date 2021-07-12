<script lang="ts">
  import { getContext, onMount } from "svelte";
  import { combineLatest, Observable } from "rxjs";
  import { map, startWith, withLatestFrom } from "rxjs/operators";

  import { users$, deleteUser, addUser, makeUser } from "src/stores/users";
  import { focusAreaObservable$ } from "src/stores/focusArea";
  import type { Api } from "src/api";

  import { makeMouseMoveCoordinates$ } from "src/reactiveUtils";

  const api = getContext<Api>("api")!;
  const scale$ = getContext<Observable<number>>("scale$")!;
  const canvas$ = getContext<Observable<HTMLCanvasElement>>("canvas$")!;

  const coordinates$ = makeMouseMoveCoordinates$(canvas$);

  coordinates$
    .pipe(withLatestFrom(focusAreaObservable$, scale$))
    .subscribe(([pos, { coordinates }, scale]) => {
      api.updateUser(
        makeUser("", {
          left: pos.x / scale + coordinates.x,
          top: pos.y / scale + coordinates.y,
        })
      );
    });

  const mappedUsers$ = combineLatest([
    users$,
    focusAreaObservable$,
    scale$,
  ]).pipe(
    map(([serverUsers, { coordinates }, scale]) => {
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
