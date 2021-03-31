export type Fiber = {
  x: number;
  y: number;
  toX: number;
  toY: number;
  color: string;
  size: number;
};
export type Fibers = Fiber[];

export function makeFiber(
  x: number,
  y: number,
  toX: number,
  toY: number,
  color: string,
  size: number
): Fiber {
  return { x, y, toX, toY, color, size };
}

export function moveFiber(
  { x, y, toX, toY, color, size }: Fiber,
  left: number,
  top: number
): Fiber {
  return makeFiber(x + left, y + top, toX + left, toY + top, color, size);
}

export function scaleFiber(
  { x, y, toX, toY, color, size }: Fiber,
  scale: number
): Fiber {
  return makeFiber(x / scale, y / scale, toX / scale, toY / scale, color, size);
}

export function renderFiber(
  ctx: CanvasRenderingContext2D,
  { x, y, toX, toY, color, size }: Fiber
): void {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // @ts-ignore
  ctx.fillStyle = ctx.strokeStyle = color;
  ctx.lineWidth = size;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}
