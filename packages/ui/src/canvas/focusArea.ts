import { Observable, combineLatest } from "rxjs";
import { map, filter, withLatestFrom } from "rxjs/operators";

import { fitInRect$ } from "@/reactiveUtils";
import type { MouseCoordinates, MouseVector } from "@/reactiveUtils";
import { cut } from "@/utils";
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

export function makeFocusArea$(
  coordinates$: Observable<MouseCoordinates>,
  dimensions$: Observable<{ width: number; height: number }>,
  ratio$: Observable<number>,
  zoom$: Observable<number>
): Observable<FocusArea> {
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

  const normalizedAreaCoordinates$ = combineLatest([
    coordinates$,
    innerDimensions$,
  ]).pipe(
    map(([{ x, y }, { width, height }]) => {
      return { x: x - width / 2, y: y - height / 2 };
    })
  );

  const fittedAreaCoordinates$ = combineLatest([
    dimensions$,
    innerDimensions$,
    normalizedAreaCoordinates$,
  ]).pipe(
    map(
      ([
        { width, height },
        { width: innerWidth, height: innerHeight },
        { x, y },
      ]) => {
        return {
          x: cut(0, width - innerWidth)(x),
          y: cut(0, height - innerHeight)(y),
        };
      }
    )
  );

  return combineLatest([fittedAreaCoordinates$, innerDimensions$]).pipe(
    map(([areaCoordinates, { width, height }]) => ({
      coordinates: areaCoordinates,
      width,
      height,
    }))
  );
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
