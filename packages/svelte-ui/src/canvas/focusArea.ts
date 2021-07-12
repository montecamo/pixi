import { Observable, combineLatest } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";

import { fitInRect$ } from "src/reactiveUtils";
import type { MouseCoordinates, MouseVector } from "src/reactiveUtils";
import { cut } from "src/utils";
import type { CanvasImageData } from "./imageData";

export type FocusArea = {
  coordinates: MouseCoordinates;
  width: number;
  height: number;
};

export function makeFocusAreaScale$(
  canvas$: Observable<HTMLCanvasElement>,
  focusArea$: Observable<FocusArea>
): Observable<number> {
  const scale$ = combineLatest([focusArea$, canvas$]).pipe(
    map(([{ width }, canvas]) => {
      return canvas.width / width;
    })
  );

  return scale$;
}

export function makeFocusAreaImageData$(
  canvas$: Observable<HTMLCanvasElement>,
  focusArea$: Observable<FocusArea>
): Observable<CanvasImageData> {
  // @ts-ignore
  const imageData$: Observable<{
    data: ImageData;
    width: number;
    height: number;
  }> = combineLatest([focusArea$, canvas$]).pipe(
    map(([{ width, height, coordinates }, canvas]) => {
      const ctx = canvas.getContext("2d");

      return {
        data: ctx?.getImageData(coordinates.x, coordinates.y, width, height),
        width,
        height,
      };
    }),
    filter(Boolean)
  );

  return imageData$;
}
