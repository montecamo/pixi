import { concat, of, fromEvent, Observable } from "rxjs";
import { switchMap, takeUntil, map, scan, startWith } from "rxjs/operators";

import { cut } from "../utils/cut";
import { fromEvent$, stopDefaults$ } from "./event";

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

export function makeMousePressedOffset$(
  element$: Observable<HTMLElement>,
  initial: number = 0
): Observable<{ left: number; top: number }> {
  const pressedMove$ = makeMousePressedMove$(element$);

  return pressedMove$.pipe(
    map(({ offsetX, offsetY }) => ({ left: offsetX, top: offsetY })),

    startWith({ left: initial, top: initial })
  );
}

export function makeMouseOffset$(
  element$: Observable<HTMLElement>,
  initial: number = 0
): Observable<{ left: number; top: number }> {
  const move$ = fromEvent$<MouseEvent>(element$, "mousemove");

  return move$.pipe(
    map(({ offsetX, offsetY }) => ({ left: offsetX, top: offsetY })),

    startWith({ left: initial, top: initial })
  );
}

export function makeMousePressedDelta$(
  element$: Observable<HTMLElement>
): Observable<{ x: number; y: number; toX: number; toY: number }> {
  const pressedMove$ = makeMousePressedMove$(element$);

  return pressedMove$.pipe(
    map(({ movementX, movementY, offsetX, offsetY }) => ({
      x: offsetX,
      y: offsetY,
      toX: offsetX - movementX,
      toY: offsetY - movementY,
    }))
  );
}

export function makeMouseZoom$(
  element$: Observable<HTMLElement>,
  options: { max?: number; min?: number; initial?: number; speed?: number }
): Observable<number> {
  const { max = 100, min = 0, initial = 0, speed = 0.5 } = options ?? {};

  const wheel$ = fromEvent$<WheelEvent>(element$, "wheel");

  return wheel$.pipe(
    stopDefaults$(),
    scan((acc, curr) => cut(min, max)(acc + curr.deltaY * speed), initial),
    startWith(initial)
  );
}

export function makeMouseWheelDelta$(
  element$: Observable<HTMLElement>
): Observable<{ x: number; y: number }> {
  const wheel$ = fromEvent$<WheelEvent>(element$, "wheel");

  return wheel$.pipe(
    stopDefaults$(),
    map(({ deltaX, deltaY }) => ({ x: deltaX, y: deltaY })),
    startWith({ x: 0, y: 0 })
  );
}
