import { Observable, combineLatest } from "rxjs";

export type CanvasImageData = {
  width: number;
  height: number;
  data: ImageData;
};

export function applyScaledImageData(
  canvas$: Observable<HTMLCanvasElement>,
  scale$: Observable<number>,
  imageData$: Observable<CanvasImageData>
): void {
  combineLatest([scale$, imageData$, canvas$]).subscribe(
    ([scale, { data, height, width }, canvas]) => {
      const ctx = canvas.getContext("2d");

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = width;
      tempCanvas.height = height;

      ctx?.save();

      ctx?.setTransform(1, 0, 0, 1, 0, 0);
      ctx?.clearRect(0, 0, canvas.width, canvas.height);

      tempCanvas.getContext("2d")?.putImageData(data, 0, 0);
      ctx?.scale(scale, scale);
      if (ctx) {
        ctx.imageSmoothingQuality = "high";
      }

      ctx?.drawImage(tempCanvas, 0, 0);

      ctx?.restore();
    }
  );
}
