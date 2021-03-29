import { Observable, BehaviorSubject, combineLatest } from "rxjs";
import { map, filter } from "rxjs/operators";

import {
  makeMouseOffset$,
  makeMouseZoom$,
  makeOffsetController$,
  makeMouseDelta$,
} from "./offset";
import { makeElementRatio$ } from "./ratio";

function makeOffset$(
  referenceCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement
): Observable<{ left: number; top: number }> {
  const offset$ = new BehaviorSubject({ left: 0, top: 0 });

  const mouseOffset$ = makeMouseOffset$(new BehaviorSubject(referenceCanvas));
  const mouseDelta$ = makeMouseDelta$(new BehaviorSubject(canvas));

  mouseOffset$.subscribe(offset$);
  mouseDelta$.subscribe(({ x, y }) => {
    offset$.next({ left: offset$.value.left + x, top: offset$.value.top + y });
  });

  return offset$;
}

function makeHole$(
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

export function makeCanvasReference(
  referenceCanvas: HTMLCanvasElement,
  canvas: HTMLCanvasElement
): {
  hole$: Observable<{
    width: number;
    height: number;
    top: number;
    left: number;
  }>;
  scale$: Observable<number>;
  imageData$: Observable<ImageData>;
} {
  const hole$ = makeHole$(referenceCanvas, canvas);

  // @ts-ignore
  const imageData$: Observable<ImageData> = hole$.pipe(
    map(({ width, height, left, top }) => {
      const ctx = referenceCanvas.getContext("2d");

      return ctx?.getImageData(left, top, width, height);
    }),
    filter(Boolean)
  );

  const scale$ = hole$.pipe(
    map(({ width }) => {
      return canvas.width / width;
    })
  );

  return { hole$, imageData$, scale$ };
}

export function applyCanvasReference(
  canvas: HTMLCanvasElement,
  scale$: Observable<number>,
  imageData$: Observable<ImageData>
): void {
  combineLatest([scale$, imageData$]).subscribe(([scale, data]) => {
    const ctx = canvas.getContext("2d");

    ctx?.setTransform(1, 0, 0, 1, 0, 0);
    ctx?.clearRect(0, 0, canvas.width, canvas.height);

    if (scale >= 1) {
      ctx?.putImageData(data, 0, 0);
      ctx?.scale(scale, scale);
      ctx?.drawImage(ctx.canvas, 0, 0);
    } else {
      ctx?.scale(scale, scale);
      ctx?.putImageData(data, 0, 0);
    }
  });
}
