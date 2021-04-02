import { combineLatest, Observable } from "rxjs";
import { map } from "rxjs/operators";

import { fitInRect } from "@/utils";

export function fitInRect$(
  rect$: Observable<{ width: number; height: number }>,
  fitRect$: Observable<{ width: number; height: number }>
): Observable<{ width: number; height: number }> {
  return combineLatest([rect$, fitRect$]).pipe(
    map(([rect, fitRect]) => {
      return fitInRect(rect, fitRect);
    })
  );
}
