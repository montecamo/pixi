import { BehaviorSubject } from "rxjs";

import type { User } from "./types";

const users$ = new BehaviorSubject<User[]>([]);

const getUsers = (): User[] => users$.getValue();

const addUser = (user: User) => {
  users$.next(getUsers().concat(user));
};
const deleteUser = (id: string) => {
  users$.next(getUsers().filter((u) => u.id !== id));
};

export { users$, getUsers, addUser, deleteUser };
