import { Observable, combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

import type { MouseCoordinates } from "src/reactiveUtils";
import type { CanvasImageData } from "./imageData";

export type FocusArea = {
  coordinates: MouseCoordinates;
  width: number;
  height: number;
};

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
