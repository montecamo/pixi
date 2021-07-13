import { tap } from "rxjs/operators";

export function stopDefaults$<T extends Event>() {
  return tap((event: T) => {
    event.stopPropagation();
    event.preventDefault();
  });
}
