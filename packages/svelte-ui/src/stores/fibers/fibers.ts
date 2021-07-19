import { createEvent } from "effector";
import { BehaviorSubject } from "rxjs";
import { find } from "rxjs/operators";
import { isInRect } from "src/utils";

export type FibersCoordinates = {
  x: number;
  y: number;
  toX: number;
  toY: number;
};
export type Fiber = {
  coordinates: FibersCoordinates[];
  color: string;
  size: number;
  opacity: number;
};
export type Fibers = Fiber[];

const state = [];

export function getFibers(
  x: number,
  y: number,
  width: number,
  height: number
): Fibers {
  return state.filter(({ coordinates }) => {
    return (
      coordinates.find(({ x, y }) => isInRect(x, y, width, height, x, y)) ||
      coordinates.find(({ fromX, fromY }) =>
        isInRect(x, y, width, height, fromX, fromY)
      )
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
