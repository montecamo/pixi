import { concat, of, fromEvent, Observable } from "rxjs";
import { switchMap, takeUntil, map, startWith } from "rxjs/operators";

import { fromEvent$, stopDefaults$ } from "./event";

export type MouseCoordinates = { x: number; y: number };
export type MouseVector = {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
};

export function makeMousePressedMove$(
  element$: Observable<HTMLElement>
): Observable<MouseEvent> {
  const down$ = fromEvent$<MouseEvent>(element$, "mousedown");
  const move$ = fromEvent$<MouseEvent>(element$, "mousemove");
  const up$ = fromEvent<MouseEvent>(document, "mouseup");

  return down$.pipe(
    switchMap((e) => {
      return concat(of(e), move$).pipe(takeUntil(up$));
    })
  );
}

export function makeMousePressedMoveCoordinates$(
  element$: Observable<HTMLElement>,
  initial: number = 0
): Observable<MouseCoordinates> {
  const pressedMove$ = makeMousePressedMove$(element$);

  return pressedMove$.pipe(
    map(({ offsetX, offsetY }) => ({ x: offsetX, y: offsetY })),

    startWith({ x: initial, y: initial })
  );
}

export function makeMouseMoveCoordinates$(
  element$: Observable<HTMLElement>,
  initial: number = 0
): Observable<MouseCoordinates> {
  const move$ = fromEvent$<MouseEvent>(element$, "mousemove");

  return move$.pipe(
    map(({ offsetX, offsetY }) => ({ x: offsetX, y: offsetY })),

    startWith({ x: initial, y: initial })
  );
}

export function makeMousePressedMoveVector$(
  element$: Observable<HTMLElement>
): Observable<MouseVector> {
  const pressedMove$ = makeMousePressedMove$(element$);

  return pressedMove$.pipe(
    map(({ movementX, movementY, offsetX, offsetY }) => ({
      fromX: offsetX,
      fromY: offsetY,
      toX: offsetX - movementX,
      toY: offsetY - movementY,
    }))
  );
}

export function makeMouseWheelDelta$(
  element$: Observable<HTMLElement>
): Observable<number> {
  const wheel$ = fromEvent$<WheelEvent>(element$, "wheel");

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
