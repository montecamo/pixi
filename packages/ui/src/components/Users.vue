<template>
  <div
    v-for="u in users"
    class="user"
    :key="u.id"
    :style="{
      left: `${u.position.left}px`,
      top: `${u.position.top}px`,
    }"
  ></div>
</template>

<script lang="ts">
import { defineComponent, inject, ref, onMounted } from "vue";
import { autorun } from "mobx";
import { BehaviorSubject, combineLatest, Observable } from "rxjs";
import { withLatestFrom } from "rxjs/operators";

import { UsersStore, makeUser } from "../users";
import type { FocusArea } from "../canvas";
import type { Users } from "../users";
import type { Api } from "../api";

import { makeMouseMoveCoordinates$ } from "../reactiveUtils";

export default defineComponent({
  inject: ["api"],
  setup() {
    const api = inject<Api>("api")!;
    const focusArea$ = inject<Observable<FocusArea>>("focusArea$")!;
    const scale$ = inject<Observable<number>>("scale$")!;
    const canvas$ = inject<Observable<HTMLCanvasElement>>("canvas$")!;

    const coordinates$ = makeMouseMoveCoordinates$(canvas$);

    coordinates$
      .pipe(withLatestFrom(focusArea$!, scale$))
      .subscribe(([pos, { coordinates }, scale]) => {
        api.updateUser(
          makeUser("", {
            left: pos.x / scale + coordinates.x,
            top: pos.y / scale + coordinates.y,
          })
        );
      });

    const store = new UsersStore();

    const users = ref<Users>(store.users);

    onMounted(() => {
      if (api && focusArea$ && scale$) {
        api.usersDisconnected$.subscribe((id) => {
          store.deleteUser(id);
        });

        api.users$.subscribe((user) => {
          store.deleteUser(user.id);
          store.addUser(user);
        });

        const users$ = new BehaviorSubject<Users>(users.value);

        autorun(() => {
          users$.next(store.users);
        });

        combineLatest([users$, focusArea$, scale$]).subscribe(
          ([serverUsers, { coordinates }, scale]) => {
            users.value = serverUsers.map((u) =>
              makeUser(u.id, {
                left: (u.position.left - coordinates.x) * scale,
                top: (u.position.top - coordinates.y) * scale,
              })
            );
          }
        );
      }
    });

    return { users };
  },
});
</script>

<style scoped>
.user {
  position: fixed;

  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: lightcoral;
}
</style>
