import { Injectable } from '@angular/core';
import { Account } from 'src/app/models/account';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  userKey: string = 'userKey'

  constructor() { }

  setCurrentUser(user: Account) {
    localStorage.setItem(this.userKey, JSON.stringify(user))
  }

  getCurrentUser(): Promise<Account> {
    return new Promise<Account>((resolve, reject) => {
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
