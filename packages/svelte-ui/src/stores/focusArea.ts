import { createStore, createEvent } from "effector";
import { BehaviorSubject } from "rxjs";
import clamp from "lodash-es/clamp";
import { CANVAS_WIDTH, CANVAS_HEIGHT } from "src/constants";
import { fitInRect } from "src/utils";

import type { MouseCoordinates } from "src/reactiveUtils";

// ZOOM
const STEP = 0.5;
const MIN_ZOOM = 10;
const MAX_ZOOM = 100;
const INITIAL_ZOOM = 20;

export type Zoom = number;

const zoom = createEvent<{ delta; coordinates: MouseCoordinates }>();

const zoom$ = createStore<number>(INITIAL_ZOOM).on(zoom, (state, { delta }) =>
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

// zoom.watch(({ coordinates }) => moveArea(coordinates));

function fitFocusArea(area): FocusArea {
  return {
    ...area,
    ...fitInRect(
      { width: area.width, height: area.height },
      { width: CANVAS_WIDTH, height: CANVAS_HEIGHT }
    ),
  };
}
function fitCoordinates(area): FocusArea {
  return {
    ...area,
    coordinates: {
      x: clamp(area.coordinates.x, 0, CANVAS_WIDTH - area.width),
      y: clamp(area.coordinates.y, 0, CANVAS_HEIGHT - area.height),
    },
  };
}
function centerArea(area): FocusArea {
  return {
    ...area,
    coordinates: {
      x: area.coordinates.x - area.width / 2,
      y: area.coordinates.y - area.height / 2,
    },
  };
}

function mapArea(area) {
  return fitCoordinates(fitFocusArea(area));
}

const focusArea$ = createStore(INITIAL)
  .on(moveArea, (area, coordinates) =>
    mapArea(
      centerArea({
        ...area,
        coordinates,
      })
    )
  )
  .on(zoom$, (area, zoom) => {
    const ratio = area.height / area.width;
    const nextWidth = (CANVAS_WIDTH * zoom) / 100;
    const nextHeight = nextWidth * ratio;
    const deltaX = area.width - nextWidth;
    const deltaY = area.height - nextHeight;

    return mapArea({
      coordinates: {
        x: area.coordinates.x + deltaX / 2,
        y: area.coordinates.y + deltaY / 2,
      },
      width: nextWidth,
      height: nextHeight,
    });
  })
  .on(changeRatio, (area, ratio) => {
    const nextWidth = (CANVAS_WIDTH * zoom$.getState()) / 100;

    return mapArea({ ...area, width: nextWidth, height: nextWidth * ratio });
  });

const focusAreaObservable$ = new BehaviorSubject(INITIAL);
focusArea$.subscribe(focusAreaObservable$);

export { focusArea$, focusAreaObservable$, moveArea, changeRatio, zoom };
