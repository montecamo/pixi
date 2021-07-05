import { BehaviorSubject, Observable, merge } from "rxjs";
import { switchMap } from "rxjs/operators";

export type ExtendableObservable<T> = {
  observable$: Observable<T>;
  attachSource(source$: Observable<T>): void;
};

export function makeExtendableObservable$<T>(
  initialValue: T
): ExtendableObservable<T> {
  const observable$ = new BehaviorSubject<T>(initialValue);
  const sources$ = new BehaviorSubject<Array<Observable<T>>>([]);

  sources$
    .pipe(switchMap((sources) => merge(...sources)))
    .subscribe(observable$);

  return {
    attachSource(source$: Observable<T>) {
      sources$.next(sources$.value.concat(source$));
    },
    observable$,
  };
}
