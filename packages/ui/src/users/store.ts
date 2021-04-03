import { makeAutoObservable } from "mobx";

import type { User } from "./types";

export class UsersStore {
  users: User[];

  constructor() {
    this.users = [];

    makeAutoObservable(this);
  }

  addUser(user: User) {
    this.users.push(user);
  }

  deleteUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
  }
}
