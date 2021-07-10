import { createStore, createEvent } from "effector";
import clamp from "lodash-es/clamp";

const STEP = 0.5;
const MIN = 0;
const MAX = 100;

export type Zoom = number;

const zoomIn = createEvent();
const zoomOut = createEvent();

const zoom$ = createStore(MIN)
  .on(zoomIn, (state) => state + STEP)
  .on(zoomOut, (state) => state - STEP)
  .map((z) => clamp(z, MIN, MAX));

export { zoom$, zoomIn, zoomOut };
