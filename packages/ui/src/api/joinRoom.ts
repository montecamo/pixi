import type { Fibers } from "@/Fibers";

import type { Socket } from "socket.io-client";
import { Observable, Subject } from "rxjs";

export function joinRoom(
  socket: typeof Socket,
  id: string
): Observable<Fibers> {
  const fibers$ = new Subject<Fibers>();

  socket.emit("join", id);

  socket.on("fibers", (fibers: Fibers) => {
    fibers$.next(fibers);
  });

  return fibers$;
}
