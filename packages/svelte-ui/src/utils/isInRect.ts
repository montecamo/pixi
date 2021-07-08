import { isInRange } from "./isInRange";

export function isInRect(x, y, width, height, targetX, targetY): boolean {
  return isInRange(targetX, x, x + width) && isInRange(targetY, y, y + height);
}
