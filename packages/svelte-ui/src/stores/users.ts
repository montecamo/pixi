import { createStore, createEvent } from "effector";

export type User = {
  id: string;
  position: { top: number; left: number };
};
export type Users = User[];

function makeUser(id: string, position: { top: number; left: number }): User {
  return { id, position };
}

const users$ = createStore([]);
const addUser = createEvent<User>();
const deleteUser = createEvent<string>();

users$
  .on(addUser, (state, user) => state.concat(user))
  .on(deleteUser, (state, id) => state.filter((u) => u.id !== id));

export { users$, addUser, deleteUser, makeUser };
