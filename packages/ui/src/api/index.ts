import { Observable, Subject } from "rxjs";
import io from "socket.io-client";

import type { User } from "@/users";
import type { Fibers } from "@/fibers";

export type Api = {
  joinRoom: (id: string) => void;
  draw: (fibers: Fibers) => void;
  updateUser: (user: User) => void;
  fibers$: Observable<Fibers>;
  users$: Observable<User>;
  usersDisconnected$: Observable<string>;
};

export function makeApi(): Api {
  const socket = io("ws://localhost:3001");
  const fibers$ = new Subject<Fibers>();
  const users$ = new Subject<User>();
  const usersDisconnected$ = new Subject<string>();

  let roomId = "";

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

  return {
    joinRoom: (id) => {
      roomId = id;

      socket.emit("joinRoom", id);
    },
    updateUser: (user) => {
      socket.emit("users", { roomId, ...user });
    },
    draw: (fibers: Fibers) => {
      socket.emit("fibers", { fibers, roomId });
    },
    fibers$,
    users$,
    usersDisconnected$,
  };
}
