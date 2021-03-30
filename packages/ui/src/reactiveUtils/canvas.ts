import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

import {
  makeMousePressedOffset$,
  makeMouseZoom$,
  makeMouseWheelDelta$,
} from "./mouse";
import { makeOffsetController$ } from "./offset";
import { makeElementRatio$ } from "./ratio";

const INITIAL_ZOOM = 20;
const INITIAL_OFFSET = 0;
const MIN_ZOOM = 10;
const MAX_ZOOM = 100;
const DELTA_SPEED = 0.5;

function makeOffset$(
  referenceCanvas$: Observable<HTMLCanvasElement>,
  canvas$: Observable<HTMLCanvasElement>
): Observable<{ left: number; top: number }> {
  const offset$ = new BehaviorSubject({ left: 0, top: 0 });

  const mouseOffset$ = makeMousePressedOffset$(
    referenceCanvas$,
    INITIAL_OFFSET
  );
  const mouseDelta$ = makeMouseWheelDelta$(canvas$);

  mouseOffset$.subscribe(offset$);
  mouseDelta$.subscribe(({ x, y }) => {
    offset$.next({ left: offset$.value.left + x, top: offset$.value.top + y });
  });

  return offset$;
}

export function makeHole$(
  referenceCanvas$: Observable<HTMLCanvasElement>,
  canvas$: Observable<HTMLCanvasElement>
): Observable<{ width: number; height: number; left: number; top: number }> {
  const offset$ = makeOffset$(referenceCanvas$, canvas$);

  const zoom$ = makeMouseZoom$(referenceCanvas$, {
    max: MAX_ZOOM,
    min: MIN_ZOOM,
    speed: DELTA_SPEED,
    initial: INITIAL_ZOOM,
  });

  const ratio$ = makeElementRatio$(canvas$);

  const hole$ = makeOffsetController$(
    offset$,
    referenceCanvas$.pipe(map(({ width, height }) => ({ width, height }))),
    ratio$,
    zoom$
  );

  return hole$;
}

export function makeHoleScale$(
  canvas$: Observable<HTMLCanvasElement>,
  hole$: Observable<{
    width: number;
    height: number;
    top: number;
    left: number;
  }>
): Observable<number> {
  const scale$ = combineLatest([hole$, canvas$]).pipe(
    map(([{ width }, canvas]) => {
      return canvas.width / width;
    })
  );

  return scale$;
}

export function makeHoleImageData$(
  referenceCanvas$: Observable<HTMLCanvasElement>,
  hole$: Observable<{
    width: number;
    height: number;
    top: number;
    left: number;
  }>
): Observable<{ width: number; height: number; data: ImageData }> {
  // @ts-ignore
  const imageData$: Observable<{
    data: ImageData;
    width: number;
    height: number;
  }> = combineLatest([hole$, referenceCanvas$]).pipe(
    map(([{ width, height, left, top }, referenceCanvas]) => {
      const ctx = referenceCanvas.getContext("2d");

      return {
        data: ctx?.getImageData(left, top, width, height),
        width,
        height,
      };
    }),
    filter(Boolean)
  );

  return imageData$;
}

export function applyCanvasHole(
  canvas$: Observable<HTMLCanvasElement>,
  scale$: Observable<number>,
  imageData$: Observable<{ data: ImageData; width: number; height: number }>
): void {
  combineLatest([scale$, imageData$, canvas$]).subscribe(
    ([scale, { data, height, width }, canvas]) => {
      const ctx = canvas.getContext("2d");
      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;

      ctx?.setTransform(1, 0, 0, 1, 0, 0);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      tempCanvas.getContext("2d")?.putImageData(data, 0, 0);
      ctx?.scale(scale, scale);
      ctx?.drawImage(tempCanvas, 0, 0);
    }
  );
}
