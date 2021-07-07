import { Observable, Subject, ReplaySubject } from "rxjs";
import io from "socket.io-client";

import type { User } from "src/stores/users";
import type { Fibers } from "src/fibers";

export type Api = {
  joinRoom: (id: string) => void;
  getFibers: () => void;
  draw: (fibers: Fibers) => void;
  updateUser: (user: User) => void;
  createRoom: () => void;
  fibers$: Observable<Fibers>;
  users$: Observable<User>;
  usersDisconnected$: Observable<string>;
  roomCreated$: Observable<string>;
};

export function makeApi(): Api {
  const socket = io("ws://localhost:3001");
  const fibers$ = new Subject<Fibers>();
  const users$ = new Subject<User>();
  const usersDisconnected$ = new Subject<string>();
  const roomCreated$ = new Subject<string>();

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
    roomCreated$.next(id);
  });
  socket.on("roomJoined", (id: string) => {
    roomId = id;
  });
  socket.on("userDisconnected", (uid: string) => {
    usersDisconnected$.next(uid);
  });

  return {
    joinRoom: (id) => {
      socket.emit("joinRoom", id);
    },
    getFibers: () => {
      socket.emit("getFibers", roomId);
    },
    createRoom: () => {
      socket.emit("createRoom");
    },
    updateUser: (user) => {
      socket.emit("users", { roomId, ...user });
    },
    draw: (fibers) => {
      socket.emit("fibers", { fibers, roomId });
    },
    fibers$,
    users$,
    usersDisconnected$,
    roomCreated$,
  };
}
