import type { User } from "./types";

export function makeUser(
  id: string,
  position: { top: number; left: number }
): User {
  return { id, position };
}
