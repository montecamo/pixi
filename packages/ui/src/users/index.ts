export type User = {
  id: string;
  position: { top: number; left: number };
};
export type Users = User[];

export function makeUser(
  id: string,
  position: { top: number; left: number }
): User {
  return { id, position };
}
