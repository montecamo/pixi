export type Action = number[];
export type Actions = Action[];

export function makeAction(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  return [fromX, fromY, toX, toY];
}

export function renderAction(
  ctx: CanvasRenderingContext2D,

  [fromX, fromY, toX, toY]: Action,
  { color, size }: { color: string; size: number }
): void {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.fillStyle = ctx.strokeStyle = color;
  ctx.lineWidth = size;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}
