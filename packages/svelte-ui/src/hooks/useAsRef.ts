import type { UnwrapRef, Ref } from "vue";
import { ref } from "vue";
import { Observable } from "rxjs";

export function useAsRef<T>(
  observable$: Observable<T>,
  initial: T
): Ref<UnwrapRef<T>> {
  const r = ref(initial);

  observable$.subscribe((val) => {
    // @ts-ignore
    r.value = val;
  });

  return r;
}
