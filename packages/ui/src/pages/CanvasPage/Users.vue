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
import { defineComponent, inject, onMounted } from "vue";
import { combineLatest, Observable } from "rxjs";
import { withLatestFrom } from "rxjs/operators";
import { useAsRef } from "@/hooks";

import {
  users$,
  getUsers,
  deleteUser,
  addUser,
  makeUser,
} from "@/stores/users";
import type { FocusArea } from "@/canvas";
import type { Api } from "@/api";

import { makeMouseMoveCoordinates$ } from "@/reactiveUtils";

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

    const users = useAsRef(users$, getUsers());

    onMounted(() => {
      if (api && focusArea$ && scale$) {
        api.usersDisconnected$.subscribe((id) => {
          deleteUser(id);
        });

        api.users$.subscribe((user) => {
          deleteUser(user.id);
          addUser(user);
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
