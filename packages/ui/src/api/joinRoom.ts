import type { Fibers } from "@/fibers";
import type { User } from "@/users";

import type { Socket } from "socket.io-client";
import { Observable, Subject } from "rxjs";

export function joinRoom(
  socket: typeof Socket,
  id: string
): {
  fibers$: Observable<Fibers>;
  users$: Observable<User>;
  usersDisconnected$: Observable<string>;
} {
  const fibers$ = new Subject<Fibers>();
  const users$ = new Subject<User>();
  const usersDisconnected$ = new Subject<string>();

  socket.emit("joinRoom", id);

  socket.on("joinedRoom", (fibers: Fibers) => {
    fibers$.next(fibers);
  });

  socket.on("fibers", (fibers: Fibers) => {
    fibers$.next(fibers);
  });
  socket.on("users", (user: User) => {
    users$.next(user);
  });
  socket.on("userDisconnected", (uid: string) => {
    usersDisconnected$.next(uid);
  });

  return { fibers$, users$, usersDisconnected$ };
}
