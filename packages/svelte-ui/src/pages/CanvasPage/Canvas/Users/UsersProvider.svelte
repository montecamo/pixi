<script lang="ts">
  import { filter } from "rxjs/operators";
  import { getContext, onMount } from "svelte";
  import type { Api } from "src/api";
  import { makeUser, deleteUser, addUser } from "src/stores/users";
  import type { User } from "src/stores/users";

  import { makeMouseMoveCoordinates$ } from "src/reactiveUtils";

  export let scale: number;
  export let offsetX: number;
  export let offsetY: number;

  const { updateUser, usersDisconnected$, users$ } = getContext<Api>("api");

  const coordinates$ = makeMouseMoveCoordinates$(
    document as unknown as HTMLElement
  );

  $: updateUser(
    makeUser("", {
      left: $coordinates$.x / scale + offsetX,
      top: $coordinates$.y / scale + offsetY,
    })
  );

  onMount(() => {
    const subscription = users$
      .pipe(filter<User>(Boolean))
      .subscribe((u) => deleteUser(u.id));

    return () => subscription.unsubscribe();
  });

  onMount(() => {
    const subscription = users$.subscribe((u) => addUser(u));

    return () => subscription.unsubscribe();
  });

  $: deleteUser($usersDisconnected$);
</script>
