import type { Fibers } from "@/fibers";
import type { User } from "@/users";

import type { Socket } from "socket.io-client";
import { Observable, Subject } from "rxjs";

export function joinRoom(
  socket: typeof Socket,
  id: string
): { fibers$: Observable<Fibers>; users$: Observable<User> } {
  const fibers$ = new Subject<Fibers>();
  const users$ = new Subject<User>();

  socket.emit("join", id);

  socket.on("fibers", (fibers: Fibers) => {
    fibers$.next(fibers);
  });
  socket.on("users", (user: User) => {
    users$.next(user);
  });

  return { fibers$, users$ };
}
