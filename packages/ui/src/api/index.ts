import type { Fibers } from "@/fibers";
import { Observable } from "rxjs";

import { joinRoom } from "./joinRoom";
import { draw } from "./draw";
import io from "socket.io-client";

export function makeApi(): {
  joinRoom: (id: string) => Observable<Fibers>;
  draw: (fibers: Fibers) => void;
} {
  const socket = io("ws://localhost:3001");
  let roomId = "";

  return {
    joinRoom: (id) => {
      roomId = id;

      return joinRoom(socket, id);
    },
    draw: (fibers: Fibers) => draw(socket, roomId, fibers),
  };
}
