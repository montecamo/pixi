import type { Fiber, FibersCoordinates } from "./fibers";
import { hexToRgb } from "src/utils";

export function makeFibersCoordinates(
  x: number,
  y: number,
  toX: number,
  toY: number
) {
  return {
    x,
    y,
    toX,
    toY,
  };
}
export function makeFiber(
  coordinates: FibersCoordinates[],
  color: string,
  size: number,
  opacity: number
): Fiber {
  return { coordinates, color, size, opacity };
}

export function moveFiber(
  { coordinates, color, size, opacity }: Fiber,
  left: number,
  top: number
): Fiber {
  return makeFiber(
    coordinates.map(({ x, y, toX, toY }) =>
      makeFibersCoordinates(x + left, y + top, toX + left, toY + top)
    ),
    color,
    size,
    opacity
  );
}

export function scaleFiber(
  { coordinates, color, size, opacity }: Fiber,
  scale: number
): Fiber {
  return makeFiber(
    coordinates.map(({ x, y, toX, toY }) =>
      makeFibersCoordinates(x / scale, y / scale, toX / scale, toY / scale)
    ),
    color,
    size / scale,
    opacity
  );
}
export function scaleFiberCoordinates(
  { coordinates, color, size, opacity }: Fiber,
  scale: number
): Fiber {
  return makeFiber(
    coordinates.map(({ x, y, toX, toY }) =>
      makeFibersCoordinates(x / scale, y / scale, toX / scale, toY / scale)
    ),
    color,
    size,
    opacity
  );
}

export function renderFiber(
  ctx: CanvasRenderingContext2D,
  { coordinates, color, size, opacity }: Fiber
): void {
  const [r, g, b] = hexToRgb(color);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // @ts-ignore
  ctx.fillStyle = ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
  ctx.lineWidth = size;

  ctx.beginPath();

  coordinates.forEach(({ x, y, toX, toY }) => {
    ctx.moveTo(x, y);
    ctx.lineTo(toX, toY);
  });

  ctx.stroke();
}
