import { fromEvent, Observable } from "rxjs";
import { switchMap, tap } from "rxjs/operators";

export function fromEvent$<T>(
  element$: Observable<HTMLElement>,
  type: string
): Observable<T> {
  return element$.pipe(
    switchMap((element) => {
      return fromEvent<T>(element, type);
    })
  );
}

export function stopDefaults$<T extends Event>() {
  return tap((event: T) => {
    event.stopPropagation();
    event.preventDefault();
  });
}
