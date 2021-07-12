import { createStore, createEvent } from "effector";
import { BehaviorSubject } from "rxjs";

const updateBrushSize = createEvent<number>();
const updateBrushColor = createEvent<string>();

const INITIAL = {
  color: "#fff",
  size: 24,
};

const brush$ = createStore(INITIAL)
  .on(updateBrushSize, (state, size) => ({ ...state, size }))
  .on(updateBrushColor, (state, color) => ({ ...state, color }));

const brushObservable$ = new BehaviorSubject(INITIAL);
brush$.subscribe(brushObservable$);

export { brush$, brushObservable$, updateBrushSize, updateBrushColor };
