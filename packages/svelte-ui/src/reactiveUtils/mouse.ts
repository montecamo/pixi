import { concat, of, fromEvent, Observable } from "rxjs";
import { switchMap, takeUntil, map, startWith, buffer } from "rxjs/operators";

import { stopDefaults$ } from "./event";

export type MouseCoordinates = { x: number; y: number };
export type MouseVector = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export function makeMousePressedMoves$(
  element: HTMLElement
): Observable<MouseEvent[]> {
  const down$ = fromEvent<MouseEvent>(element, "mousedown");
  const move$ = fromEvent<MouseEvent>(element, "mousemove");
  const up$ = fromEvent<MouseEvent>(document, "mouseup");

  return down$.pipe(
    switchMap((e) => {
      return concat(of(e), move$).pipe(takeUntil(up$), buffer(up$));
    })
  );
}

export function fromMousePressedMove$(
  element: HTMLElement
): Observable<MouseEvent> {
  const down$ = fromEvent<MouseEvent>(element, "mousedown");
  const move$ = fromEvent<MouseEvent>(element, "mousemove");
  const up$ = fromEvent<MouseEvent>(document, "mouseup");

  return down$.pipe(
    switchMap((e) => {
      return concat(of(e), move$).pipe(takeUntil(up$));
    })
  );
}

export function makeMouseMoveCoordinates$(
  element: HTMLElement,
  initial: number = 0
): Observable<MouseCoordinates> {
  const move$ = fromEvent<MouseEvent>(element, "mousemove");

  return move$.pipe(
    map(({ offsetX, offsetY }) => ({ x: offsetX, y: offsetY })),

    startWith({ x: initial, y: initial })
  );
}

export function makeMouseVector({
  movementX,
  movementY,
  offsetX,
  offsetY,
}: MouseEvent): MouseVector {
  return {
    fromX: offsetX,
    fromY: offsetY,
    toX: offsetX - movementX,
    toY: offsetY - movementY,
  };
}
export function makeMousePressedMoveVectors$(
  element: HTMLElement,
  moves$: Observable<MouseEvent[]> = makeMousePressedMoves$(element)
): Observable<MouseVector[]> {
  return moves$.pipe(map((moves) => moves.map(makeMouseVector)));
}

export function makeMouseWheelDelta$(element: HTMLElement): Observable<number> {
  const wheel$ = fromEvent<WheelEvent>(element, "wheel");

  return wheel$.pipe(
    stopDefaults$(),
    map(({ deltaX, deltaY }) => {
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        return deltaX;
      }

      return deltaY;
    }),
    startWith(0)
  );
}
