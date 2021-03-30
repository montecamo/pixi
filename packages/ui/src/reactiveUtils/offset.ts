import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { cut, fitInRect } from "../utils";

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
