import { createStore, createEvent } from "effector";
import { BehaviorSubject } from "rxjs";

import { COLORS } from "src/constants";

const updateBrushSize = createEvent<number>();
const updateBrushColor = createEvent<string>();

const INITIAL = {
  color: COLORS[0],
  size: 24,
};

const brush$ = createStore(INITIAL)
  .on(updateBrushSize, (state, size) => ({ ...state, size }))
  .on(updateBrushColor, (state, color) => ({ ...state, color }));

const brushObservable$ = new BehaviorSubject(INITIAL);
brush$.subscribe(brushObservable$);

export { brush$, brushObservable$, updateBrushSize, updateBrushColor };
