import { createStore, createEvent } from "effector";
import { BehaviorSubject } from "rxjs";
import clamp from "lodash-es/clamp";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "src/constants";

import type { MouseCoordinates } from "src/reactiveUtils";

// ZOOM
const STEP = 0.5;
const MIN_ZOOM = 10;
const MAX_ZOOM = 100;
const INITIAL_ZOOM = 20;

export type Zoom = number;

const zoom = createEvent<number>();

const zoom$ = createStore<number>(INITIAL_ZOOM).on(zoom, (state, delta) =>
  clamp(state + delta * STEP, MIN_ZOOM, MAX_ZOOM)
);
// ZOOM

export type FocusArea = {
  coordinates: MouseCoordinates;
  width: number;
  height: number;
};
const INITIAL = {
  width: (CANVAS_WIDTH * INITIAL_ZOOM) / 100,
  height: (CANVAS_HEIGHT * INITIAL_ZOOM) / 100,
  coordinates: { x: 0, y: 0 },
};

const moveArea = createEvent<MouseCoordinates>();
const changeRatio = createEvent<number>();

const focusArea$ = createStore(INITIAL)
  .on(moveArea, (area, coords) => ({
    ...area,
    coordinates: coords,
  }))
  .on(zoom$, (area, zoom) => ({
    ...area,
    width: (CANVAS_WIDTH * zoom) / 100,
    height: (CANVAS_HEIGHT * zoom) / 100,
  }))
  .on(changeRatio, (area, ratio) => ({ ...area, height: area.width * ratio }))
  .map(({ width, height, coordinates }) => ({
    width,
    height,
    coordinates: {
      x: clamp(coordinates.x - width / 2, 0, CANVAS_WIDTH - width),
      y: clamp(coordinates.y - height / 2, 0, CANVAS_HEIGHT - height),
    },
  }));

const focusAreaObservable$ = new BehaviorSubject(INITIAL);
focusArea$.subscribe(focusAreaObservable$);

export { focusArea$, focusAreaObservable$, moveArea, changeRatio, zoom };
