import { Observable, ReplaySubject } from "rxjs";
import io from "socket.io-client";

import type { User } from "@/users";
import type { Fibers } from "@/fibers";

export type Api = {
  joinRoom: (id: string) => void;
  draw: (fibers: Fibers) => void;
  updateUser: (user: User) => void;
  createRoom: () => void;
  fibers$: Observable<Fibers>;
  users$: Observable<User>;
  usersDisconnected$: Observable<string>;
  roomJoined$: Observable<string>;
};

export function makeApi(): Api {
  const socket = io("ws://localhost:3001");
  const fibers$ = new ReplaySubject<Fibers>(1);
  const users$ = new ReplaySubject<User>(1);
  const usersDisconnected$ = new ReplaySubject<string>(1);
  const roomJoined$ = new ReplaySubject<string>(1);

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
  socket.on("roomCreated", (id: string) => {
    roomJoined$.next(id);
  });
  socket.on("roomJoined", (id: string) => {
    roomJoined$.next(id);
  });
  socket.on("userDisconnected", (uid: string) => {
    usersDisconnected$.next(uid);
  });

  roomJoined$.subscribe((id) => {
    roomId = id;
  });

  return {
    joinRoom: (id) => {
      socket.emit("joinRoom", id);
    },
    createRoom: () => {
      socket.emit("createRoom");
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
    roomJoined$,
  };
}
