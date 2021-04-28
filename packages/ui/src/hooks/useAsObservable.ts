import type { Ref } from "vue";
import { watch } from "vue";
import { Observable, BehaviorSubject } from "rxjs";

export function useAsObservable<T>(ref: Ref<T>): Observable<T> {
  const value$ = new BehaviorSubject<T>(ref.value);

  watch(ref, (value: T) => value$.next(value));

  return value$;
}
