import { environment } from 'src/environments/environment'
import { Injectable } from '@angular/core';
import * as Appwrite from "appwrite";
import { Institute } from 'src/app/models/institute';
import { Session } from 'src/app/models/session';
import { Account, UserPreference } from 'src/app/models/account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Team } from 'src/app/models/team';
import { User } from 'src/app/models/user';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {
  public appwrite: Appwrite = new Appwrite();


  constructor(private snackBar: MatSnackBar) {
    // init appwrite
    this.appwrite
      .setEndpoint(environment.endpointURL)
      .setProject(environment.projectId);
  }

  async isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getAccount()
        .then(_ => resolve(true))
        .catch(error => {
          this.handleError(error)
          resolve(false)
        })
    })
  }

  async createAccount(name: string, email: string, password: string): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        // create new account -> register
        let account = await this.appwrite.account.create(email, password, name)
        resolve(account as Account)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async getAccount(): Promise<Account> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        // get current account
        console.log('Start get account')
        let account: Account = await this.appwrite.account.get() as Account
        account.prefs = await this.getAccountPrefs()
        console.log('End get account', account)
        resolve(account)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async deleteAccount(id: string): Promise<object> {
    return this.appwrite.account.deleteSession(id)
  }

  async verifyAccount(): Promise<any> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        console.log('Start verififcation')
        let res = await this.appwrite.account.createVerification('http://localhost:4200/home')
        console.log('End verififcation', res)
        resolve(res as any)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async updateAccountName(name: string): Promise<Account> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        console.log('Start update account name')
        let res = await this.appwrite.account.updateName(name)
        console.log('End update account name', res)
        resolve(res as Account)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async updateAccountEmail(email: string, password: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start update email')
        let res = await this.appwrite.account.updateEmail(email, password)
        console.log('End update email', res)
        resolve()
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async updateAccountPassword(password: string, oldPassword: string) {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start update password')
        let res = await this.appwrite.account.updatePassword(password, oldPassword)
        console.log('End update password', res)
        resolve()
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async getAccountPrefs(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start get account preferences')
        let res = await this.appwrite.account.getPrefs()
        console.log('End get account preferences', res)
        resolve(res)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async updateAccountPrefs(prefs: object): Promise<UserPreference> {
    return new Promise<UserPreference>(async (resolve, reject) => {
      try {
        console.log('Start update account preferences')
        let res = await this.appwrite.account.updatePrefs(prefs)
        console.log('End update account preferences', res)
        resolve(res as UserPreference)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async createSession(email: string, password: string): Promise<object> {
    return new Promise<object>(async (resolve, reject) => {
      try {
        let session = await this.appwrite.account.createSession(email, password)
        resolve(session)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async getSessions(): Promise<Session[]> {
    return new Promise<Session[]>(async (resolve, reject) => {
      try {
        let sessions: Session[] = await this.appwrite.account.getSessions() as Session[]
        resolve(sessions)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async getCurrentSession(): Promise<Session> {
    return new Promise<Session>(async (resolve, reject) => {
      try {
        let sessions: Session[] = await this.getSessions()

        for (let i = 0; i < sessions.length; i++) {
          const session = sessions[i]
          if (session.current) {
            resolve(session)
          }
        }

      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async createInstitute(data: any): Promise<Institute> {
    return new Promise<Institute>(async (resolve, reject) => {
      try {
        console.log("Create Institut", data)

        // owner
        let account: Account = await this.getAccount()
        let current = 'user:' + account.$id

        // team reference
        let team: Team = await this.createTeam(data?.name)
        data.teamId = team.$id

        // institute
        let institute: Institute = await this.appwrite.database.createDocument(environment.instituteCollectionId, data, [current], [current], '', '', '') as Institute
        console.log('Created Institute', institute)
        resolve(institute)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async listInstitutes(): Promise<Institute[]> {
    return new Promise<Institute[]>(async (resolve, reject) => {
      try {
        // listDocuments(collectionId: string, filters: string[], offset: number, limit: number, orderField: string, orderType: string, orderCast: string, search: string, first: number, last: number): Promise<object>;

        let res = await this.appwrite.database.listDocuments(environment.instituteCollectionId, [], 0, 50, 'name', '', '', '', 0, 0)
        let institutes: Institute[] = (res as any)['documents'] as Institute[]
        resolve(institutes)
      } catch (e) {
        this.handleError(e)
        reject()
      }

    })
  }

  async listInstitutesOfUser(teamIds: string[]): Promise<Institute[]> {
    return new Promise<Institute[]>(async (resolve, reject) => {
      try {
        // listDocuments(collectionId: string, filters: string[], offset: number, limit: number, orderField: string, orderType: string, orderCast: string, search: string, first: number, last: number): Promise<object>;

        let res = await this.appwrite.database.listDocuments(environment.instituteCollectionId, teamIds, 0, 50, 'name', '', '', '', 0, 0)
        let institutes: Institute[] = (res as any)['documents'] as Institute[]
        resolve(institutes)
      } catch (e) {
        this.handleError(e)
        reject()
      }

    })
  }

  async deleteInstitute(institute: Institute): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Delete institute', institute)
        // delete team reference
        await this.deleteTeam(institute.teamId)

        // delete institute
        let res = await this.appwrite.database.deleteDocument(environment.instituteCollectionId, institute.$id)
        resolve()
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async createTeam(name: string): Promise<Team> {
    return new Promise<Team>(async (resolve, reject) => {
      try {
        // owner
        let account: Account = await this.getAccount()
        let current = 'user:' + account.$id

        // create team
        let team: Team = await this.appwrite.teams.create(name, [current]) as Team
        console.log('Created Team', team)
        resolve(team)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async listTeams(): Promise<Team[]> {
    return new Promise<Team[]>(async (resolve, reject) => {
      try {
        // get all teams
        let res: any = await this.appwrite.teams.list('', 10, 0, 'DESC')
        resolve(res?.teams as Team[])
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async getTeam(id: string): Promise<Team> {
    return new Promise<Team>(async (resolve, reject) => {
      try {
        let team: Team = await this.appwrite.teams.get(id) as Team
        resolve(team)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async deleteTeam(id: string): Promise<object> {
    return new Promise<Team>(async (resolve, reject) => {
      try {
        console.log('Delete team-id', id)
        await this.appwrite.teams.delete(id)
        resolve()
      } catch (e) {
        this.handleError(e)
        //TODO: must be reject but runs in 500-Error reject()
        resolve()
      }
    })
  }

  private handleError(error: any): any {
    if (!error) {
      console.log('Could not handle error!')
      return;
    }

    console.log(error)
    switch (error.message) {
      case 'Unauthorized':
        break;
      case 'Not Found':

        break;
      case 'Conflict':
        this.snackBar.open('Es wurde bereits ein Account mit dieser E-Mail Adresse erstellt', 'Ok', { duration: 2000 })
        break;
      default:
        break;
    }
  }
}
