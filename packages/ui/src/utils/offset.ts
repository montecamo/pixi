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

const INITIAL_ZOOM = 50;
const INITIAL_OFFSET = 0;
const MIN_ZOOM = 10;
const MAX_ZOOM = 100;

function applyPercent$(
  value$: Observable<number>,
  percent$: Observable<number>
): Observable<number> {
  return combineLatest([value$, percent$]).pipe(
    map(([value, percent]) => (value * percent) / 100)
  );
}

function limitOffset$(
  side$: Observable<number>,
  innerSide$: Observable<number>,
  position$: Observable<number>
) {
  return combineLatest([side$, innerSide$, position$]).pipe(
    map(([side, innerSide, position]) => {
      return cut(0, side - innerSide, position);
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
  width$: Observable<number>,
  height$: Observable<number>,
  zoom$: Observable<number>
): Observable<{ left: number; top: number; width: number; height: number }> {
  const innerWidth$ = applyPercent$(width$, zoom$);
  const innerHeight$ = applyPercent$(height$, zoom$);

  const left$ = combineLatest([offset$, innerWidth$]).pipe(
    map(([{ left }, width]) => left - width / 2)
  );
  const top$ = combineLatest([offset$, innerHeight$]).pipe(
    map(([{ top }, height]) => top - height / 2)
  );

  return combineLatest([
    limitOffset$(width$, innerWidth$, left$),
    limitOffset$(height$, innerHeight$, top$),
    innerWidth$,
    innerHeight$,
  ]).pipe(
    map(([left, top, width, height]) => ({
      left,
      top,
      width,
      height,
    }))
  );
}

export function makeMouseOffset$(
  element$: Observable<HTMLElement>
): Observable<{ left: number; top: number }> {
  const down$ = fromEvent$<MouseEvent>(element$, "mousedown");
  const move$ = fromEvent$<MouseEvent>(element$, "mousemove");
  const up$ = fromEvent<MouseEvent>(document, "mouseup");

  return down$.pipe(
    switchMap((e) => {
      return concat(of(e), move$).pipe(
        takeUntil(up$),
        map(({ offsetX, offsetY }) => ({ left: offsetX, top: offsetY }))
      );
    }),
    startWith({ left: INITIAL_OFFSET, top: INITIAL_OFFSET })
  );
}

export function makeMouseZoom$(
  element$: Observable<HTMLElement>
): Observable<number> {
  const wheel$ = fromEvent$<WheelEvent>(element$, "wheel");

  return wheel$.pipe(
    tap(stopPropagation),
    scan(
      (acc, curr) => cut(MIN_ZOOM, MAX_ZOOM, acc + curr.deltaY),
      INITIAL_ZOOM
    ),
    startWith(INITIAL_ZOOM)
  );
}
