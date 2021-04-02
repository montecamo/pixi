import { Observable } from "rxjs";
import { scan, startWith } from "rxjs/operators";

import { makeMouseWheelDelta$ } from "./mouse";
import { cut } from "@/utils";

export function makeElementZoom$(
  element$: Observable<HTMLElement>,
  options: { max?: number; min?: number; initial?: number; speed?: number }
): Observable<number> {
  const { max = 100, min = 0, initial = 0, speed = 0.5 } = options ?? {};
  const wheelDelta$ = makeMouseWheelDelta$(element$);

  return wheelDelta$.pipe(
    scan((acc, curr) => cut(min, max)(acc + curr.y * speed), initial),
    startWith(initial)
  );
}
