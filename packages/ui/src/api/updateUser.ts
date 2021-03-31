import type { User } from "@/users";
import type { Socket } from "socket.io-client";

export function updateUser(
  socket: typeof Socket,
  roomId: string,
  user: User
): void {
  socket.emit("users", { roomId, ...user });
}
