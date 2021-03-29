import { ReplaySubject, Observable } from "rxjs";

function getSize(element: HTMLElement) {
  const sizes = element.getBoundingClientRect();

  return { width: sizes.width, height: sizes.height };
}

export function makeElementRatio$(element: HTMLElement): Observable<number> {
  const ratio$ = new ReplaySubject<number>(1);

  function onResize() {
    const { width, height } = getSize(element);
    ratio$.next(height / width);
  }

  // @ts-ignore
  const observer = new ResizeObserver(onResize);

  observer.observe(element);

  return ratio$;
}
