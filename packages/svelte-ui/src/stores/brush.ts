import { createStore, createEvent } from "effector";
import { BehaviorSubject } from "rxjs";
import type { MouseCoordinates } from "src/reactiveUtils";

import { COLORS } from "src/constants";

const updateBrushSize = createEvent<number>();
const updateBrushColor = createEvent<string>();
const updateBrushOpacity = createEvent<number>();
const updateBrushCoordinates = createEvent<MouseCoordinates>();

type Brush = {
  color: string;
  size: number;
  coordinates: MouseCoordinates;
  opacity: number;
};

const INITIAL = {
  color: COLORS[0],
  size: 12,
  coordinates: { x: 0, y: 0 },
  opacity: 100,
};

const brush$ = createStore<Brush>(INITIAL)
  .on(updateBrushSize, (state, size) => ({ ...state, size }))
  .on(updateBrushColor, (state, color) => ({ ...state, color }))
  .on(updateBrushOpacity, (state, opacity) => ({ ...state, opacity }))
  .on(updateBrushCoordinates, (state, coordinates) => ({
    ...state,
    coordinates,
  }));

const brushObservable$ = new BehaviorSubject(INITIAL);
brush$.subscribe(brushObservable$);

export {
  brush$,
  brushObservable$,
  updateBrushSize,
  updateBrushColor,
  updateBrushCoordinates,
  updateBrushOpacity,
};
