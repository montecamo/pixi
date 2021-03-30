import { combineLatest, concat, of, fromEvent, Observable } from "rxjs";
import {
  switchMap,
  takeUntil,
  map,
  tap,
  scan,
  startWith,
} from "rxjs/operators";

import { cut } from "./cut";
import { fitInRect } from "./fitInRect";

const INITIAL_ZOOM = 20;
const INITIAL_OFFSET = 0;
const MIN_ZOOM = 10;
const MAX_ZOOM = 100;
const DELTA_SPEED = 0.5;

function fitInRect$(
  rect$: Observable<{ width: number; height: number }>,
  fitRect$: Observable<{ width: number; height: number }>
): Observable<{ width: number; height: number }> {
  return combineLatest([rect$, fitRect$]).pipe(
    map(([rect, fitRect]) => {
      return fitInRect(rect, fitRect);
    })
  );
}

function fromEvent$<T>(
  element$: Observable<HTMLElement>,
  type: string
): Observable<T> {
  return element$.pipe(
    switchMap((element) => {
      return fromEvent<T>(element, type);
    })
  );
}

function stopPropagation<T extends Event>(event: T) {
  event.stopPropagation();
  event.preventDefault();
}

export function makeOffsetController$(
  offset$: Observable<{ left: number; top: number }>,
  dimensions$: Observable<{ width: number; height: number }>,
  ratio$: Observable<number>,
  zoom$: Observable<number>
): Observable<{ left: number; top: number; width: number; height: number }> {
  const innerDimensions$ = fitInRect$(
    combineLatest([dimensions$, ratio$, zoom$]).pipe(
      map(([{ width }, ratio, zoom]) => {
        const innerWidth = (width * zoom) / 100;
        const innerHeight = innerWidth * ratio;

        return { width: innerWidth, height: innerHeight };
      })
    ),
    dimensions$
  );

  const normalizedOffset$ = combineLatest([offset$, innerDimensions$]).pipe(
    map(([{ left, top }, { width, height }]) => {
      return { left: left - width / 2, top: top - height / 2 };
    })
  );

  const fittedOffset$ = combineLatest([
    dimensions$,
    innerDimensions$,
    normalizedOffset$,
  ]).pipe(
    map(
      ([
        { width, height },
        { width: innerWidth, height: innerHeight },
        { left, top },
      ]) => {
        return {
          left: cut(0, width - innerWidth)(left),
          top: cut(0, height - innerHeight)(top),
        };
      }
    )
  );

  return combineLatest([fittedOffset$, innerDimensions$]).pipe(
    map(([offset, dimensions]) => ({ ...offset, ...dimensions }))
  );
}

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
  element$: Observable<HTMLElement>
): Observable<{ left: number; top: number }> {
  const pressedMove$ = makeMousePressedMove$(element$);

  return pressedMove$.pipe(
    map(({ offsetX, offsetY }) => ({ left: offsetX, top: offsetY })),

    startWith({ left: INITIAL_OFFSET, top: INITIAL_OFFSET })
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
  element$: Observable<HTMLElement>
): Observable<number> {
  const wheel$ = fromEvent$<WheelEvent>(element$, "wheel");

  return wheel$.pipe(
    tap(stopPropagation),
    scan(
      (acc, curr) => cut(MIN_ZOOM, MAX_ZOOM)(acc + curr.deltaY * DELTA_SPEED),
      INITIAL_ZOOM
    ),
    startWith(INITIAL_ZOOM)
  );
}

export function makeMouseWheelDelta$(
  element$: Observable<HTMLElement>
): Observable<{ x: number; y: number }> {
  const wheel$ = fromEvent$<WheelEvent>(element$, "wheel");

  return wheel$.pipe(
    tap(stopPropagation),
    map(({ deltaX, deltaY }) => ({ x: deltaX, y: deltaY })),
    startWith({ x: 0, y: 0 })
  );
}
