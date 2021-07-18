import type { Fiber } from "./fibers";
import { hexToRgb } from "src/utils";

export function makeFiber(
  x: number,
  y: number,
  toX: number,
  toY: number,
  color: string,
  size: number,
  opacity: number
): Fiber {
  return { x, y, toX, toY, color, size, opacity };
}

export function moveFiber(
  { x, y, toX, toY, color, size, opacity }: Fiber,
  left: number,
  top: number
): Fiber {
  return makeFiber(
    x + left,
    y + top,
    toX + left,
    toY + top,
    color,
    size,
    opacity
  );
}

export function scaleFiber(
  { x, y, toX, toY, color, size, opacity }: Fiber,
  scale: number
): Fiber {
  return makeFiber(
    x / scale,
    y / scale,
    toX / scale,
    toY / scale,
    color,
    size / scale,
    opacity
  );
}
export function scaleFiberCoordinates(
  { x, y, toX, toY, color, size, opacity }: Fiber,
  scale: number
): Fiber {
  return makeFiber(
    x / scale,
    y / scale,
    toX / scale,
    toY / scale,
    color,
    size,
    opacity
  );
}

export function renderFiber(
  ctx: CanvasRenderingContext2D,
  { x, y, toX, toY, color, size, opacity }: Fiber
): void {
  const [r, g, b] = hexToRgb(color);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // @ts-ignore
  ctx.fillStyle = ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  ctx.lineWidth = size;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}
