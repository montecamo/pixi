import { Observable } from "rxjs";

function getSize(element: HTMLElement) {
  const sizes = element.getBoundingClientRect();

  return { width: sizes.width, height: sizes.height };
}

export function makeElementRatio$(element: HTMLElement): Observable<number> {
  return new Observable<number>((subscriber$) => {
    function onResize() {
      const { width, height } = getSize(element);
      subscriber$.next(height / width);
    }

    const observer = new ResizeObserver(onResize);

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  });
}
