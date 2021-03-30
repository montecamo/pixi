import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

import {
  makeMousePressedOffset$,
  makeMouseZoom$,
  makeOffsetController$,
  makeMouseWheelDelta$,
} from "./offset";
import { makeElementRatio$ } from "./ratio";

function makeOffset$(
  referenceCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement
): Observable<{ left: number; top: number }> {
  const offset$ = new BehaviorSubject({ left: 0, top: 0 });

  const mouseOffset$ = makeMousePressedOffset$(
    new BehaviorSubject(referenceCanvas)
  );
  const mouseDelta$ = makeMouseWheelDelta$(new BehaviorSubject(canvas));

  mouseOffset$.subscribe(offset$);
  mouseDelta$.subscribe(({ x, y }) => {
    offset$.next({ left: offset$.value.left + x, top: offset$.value.top + y });
  });

  return offset$;
}

export function makeHole$(
  referenceCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement
): Observable<{ width: number; height: number; left: number; top: number }> {
  const offset$ = makeOffset$(referenceCanvas, canvas);

  const zoom$ = makeMouseZoom$(new BehaviorSubject(referenceCanvas));

  const ratio$ = makeElementRatio$(canvas);

  const hole$ = makeOffsetController$(
    offset$,
    new BehaviorSubject({
      width: referenceCanvas.width,
      height: referenceCanvas.height,
    }),
    ratio$,
    zoom$
  );

  console.warn("w", referenceCanvas.width);

  return hole$;
}

export function makeHoleScale$(
  canvas: HTMLCanvasElement,
  hole$: Observable<{
    width: number;
    height: number;
    top: number;
    left: number;
  }>
): Observable<number> {
  const scale$ = hole$.pipe(
    map(({ width }) => {
      return canvas.width / width;
    })
  );

  return scale$;
}

export function makeHoleImageData$(
  referenceCanvas: HTMLCanvasElement,
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
  }> = hole$.pipe(
    map(({ width, height, left, top }) => {
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
  canvas: HTMLCanvasElement,
  scale$: Observable<number>,
  imageData$: Observable<{ data: ImageData; width: number; height: number }>
): void {
  combineLatest([scale$, imageData$]).subscribe(
    ([scale, { data, height, width }]) => {
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
