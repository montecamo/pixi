import type { Ref } from "vue";
import { watch } from "vue";
import { Observable, ReplaySubject } from "rxjs";

export function useAsObservable<T>(ref: Ref<T>): Observable<T> {
  const value$ = new ReplaySubject<T>(1);

  value$.next(ref.value);

  watch(ref, (value: T) => value$.next(value));

  return value$;
}
