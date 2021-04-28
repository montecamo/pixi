import { Observable } from "rxjs";
import { switchMap } from "rxjs/operators";

function getSize(element: HTMLElement) {
  const sizes = element.getBoundingClientRect();

  return { width: sizes.width, height: sizes.height };
}

export function makeElementRatio$(
  element$: Observable<HTMLElement>
): Observable<number> {
  return element$.pipe(
    switchMap(
      (el) =>
        new Observable<number>((subscriber$) => {
          function onResize() {
            const { width, height } = getSize(el);
            subscriber$.next(height / width);
          }

          // @ts-ignore
          const observer = new ResizeObserver(onResize);

          observer.observe(el);

          return () => {
            observer.unobserve(el);
          };
        })
    )
  );
}
