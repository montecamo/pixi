import { Observable, BehaviorSubject } from "rxjs";
import type { Writable } from "svelte/store";
import { get } from "svelte/store";

export function useAsObservable<T>(data: Writable<T>): Observable<T> {
  const value$ = new BehaviorSubject<T>(get(data));

  data.subscribe((v) => value$.next(v));

  return value$;
}
