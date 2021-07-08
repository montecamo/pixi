import { createEvent } from "effector";
import { BehaviorSubject } from "rxjs";
import { isInRect } from "src/utils";

export type Fiber = {
  x: number;
  y: number;
  toX: number;
  toY: number;
  color: string;
  size: number;
};
export type Fibers = Fiber[];

const state = [];

export function getFibers(
  x: number,
  y: number,
  width: number,
  height: number
): Fibers {
  return state.filter((f) => {
    return (
      isInRect(x, y, width, height, f.x, f.y) ||
      isInRect(x, y, width, height, f.fromX, f.fromY)
    );
  });
}

const addFibers = createEvent<Fibers>();

const fibers$ = new BehaviorSubject<Fibers>([]);

addFibers.subscribe(fibers$);
addFibers.watch((fibers) => {
  fibers.forEach((f) => {
    state.push(f);
  });
});

export { fibers$, addFibers };
