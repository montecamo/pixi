export type Action = number[];
export type Actions = Action[];

export function makeAction(
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string,
  size: number
) {
  return [fromX, fromY, toX, toY, color, size];
}

export function renderAction(
  ctx: CanvasRenderingContext2D,
  [fromX, fromY, toX, toY, color, size]: Action
): void {
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  // @ts-ignore
  ctx.fillStyle = ctx.strokeStyle = color;
  ctx.lineWidth = size;

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();
}
