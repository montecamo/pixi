import type { Fibers } from "@/fibers";
import type { User } from "@/users";
import { Observable } from "rxjs";

import { joinRoom } from "./joinRoom";
import { draw } from "./draw";
import { updateUser } from "./updateUser";
import io from "socket.io-client";

export function makeApi(): {
  joinRoom: (
    id: string
  ) => {
    fibers$: Observable<Fibers>;
    users$: Observable<User>;
    usersDisconnected$: Observable<string>;
  };
  draw: (fibers: Fibers) => void;
  updateUser: (user: User) => void;
} {
  const socket = io("ws://localhost:3001");
  let roomId = "";

  return {
    joinRoom: (id) => {
      roomId = id;

      return joinRoom(socket, id);
    },
    updateUser: (user) => {
      return updateUser(socket, roomId, user);
    },
    draw: (fibers: Fibers) => draw(socket, roomId, fibers),
  };
}
