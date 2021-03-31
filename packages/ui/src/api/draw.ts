import type { Fibers } from "@/fibers";

import type { Socket } from "socket.io-client";

export function draw(
  socket: typeof Socket,
  roomId: string,
  fibers: Fibers
): void {
  socket.emit("fibers", { fibers, roomId });
}
