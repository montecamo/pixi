import { createStore, createEvent } from "effector";

export type Canvas = {
  width: number;
  height: number;
};
const INITIAL = {
  width: 0,
  height: 0,
};

const updateCanvas = createEvent<Canvas>();

const canvas$ = createStore(INITIAL).on(updateCanvas, (_, next) => next);

export { canvas$, updateCanvas };
