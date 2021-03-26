export type Pixel = number;
export type Pixels = Pixel[];

// TODO: can optimise blank pixels
export function getPixels(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
) {
  const imageData = ctx.getImageData(0, 0, width, height);

  return new Array(...imageData.data);
}

export function setPixels(
  ctx: CanvasRenderingContext2D,
  pixels: Pixels,
  width: number,
  height: number
): void {
  const imageData = new ImageData(new Uint8ClampedArray(pixels), width, height);

  ctx.putImageData(imageData, 0, 0);
}
