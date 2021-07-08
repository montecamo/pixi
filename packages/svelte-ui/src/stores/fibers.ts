import { createStore, createEvent } from "effector";
import type { Fibers } from "src/fibers";
import { BehaviorSubject } from "rxjs";

const state = [];
const OFFSET = 10;

function isInRange(x: number, left: number, right: number): boolean {
  return left <= x && x <= right;
}
function isInRect(x, y, width, height, targetX, targetY): boolean {
  return isInRange(targetX, x, x + width) && isInRange(targetY, y, y + height);
}

export function getFibers(
  x: number,
  y: number,
  width: number,
  height: number
): Fibers {
  return state.filter((f) => {
    return (
      isInRect(
        x - OFFSET,
        y - OFFSET,
        width + OFFSET,
        height + OFFSET,
        f.x,
        f.y
      ) ||
      isInRect(
        x - OFFSET,
        y - OFFSET,
        width + OFFSET,
        height + OFFSET,
        f.fromX,
        f.fromY
      )
    );
  });
}

const fibers$ = new BehaviorSubject<Fibers>([]);
const addFibers = (fibers: Fibers) => {
  fibers$.next(fibers);

  fibers.forEach((f) => {
    state.push(f);
  });
};

export { fibers$, addFibers };
