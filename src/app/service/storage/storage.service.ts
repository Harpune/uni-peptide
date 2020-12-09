import { Injectable } from '@angular/core';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  userKey: string = 'userKey'

  constructor() { }

  setCurrentUser(user: User) {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  getCurrentUser(): Promise<User> {
    return new Promise<User>((resolve, reject) => {
      let stringUser = localStorage.getItem(this.userKey)
      if (stringUser != null) {
        resolve(JSON.parse(stringUser))
      } else {
        reject()
      }
    })
  }

  removeCurrentUser() {
    localStorage.removeItem(this.userKey)
  }
}
