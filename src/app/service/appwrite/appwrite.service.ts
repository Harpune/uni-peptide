import { environment } from 'src/environments/environment'
import { Injectable } from '@angular/core';
import * as Appwrite from "appwrite";
import { Institute } from 'src/app/models/institute';
import { Session } from 'src/app/models/session';
import { User } from 'src/app/models/user';
import { StorageService } from '../storage/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Team } from 'src/app/models/team';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {
  public appwrite: Appwrite = new Appwrite();


  constructor(private storageService: StorageService,
    private snackBar: MatSnackBar) {
    // init appwrite
    this.appwrite
      .setEndpoint(environment.endpointURL)
      .setProject(environment.projectId);
  }

  async isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getUser()
        .then(_ => resolve(true))
        .catch(error => {
          this.handleError(error)
          resolve(false)
        })
    })
  }

  async login(email: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        let user: User = await this.appwrite.account.createSession(email, password) as User
        resolve(user)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async logout(id: string): Promise<object> {
    return this.appwrite.account.deleteSession(id)
  }

  async register(name: string, email: string, password: string): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        let user: User = await this.appwrite.account.create(email, password, name) as User
        resolve(user)
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

  async getUser(): Promise<User> {
    return new Promise<User>(async (resolve, reject) => {
      try {
        let user: User = await this.appwrite.account.get() as User
        resolve(user)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  async createInstitute(data: any): Promise<Institute> {
    return new Promise<Institute>(async (resolve, reject) => {
      try {
        let team: Team = await this.createTeam(data?.name)
        data.teamId = team.$id
        let institute: Institute = await this.appwrite.database.createDocument(environment.instituteCollectionId, data, ['*'], ['*'], '', '', '') as Institute
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
        let res = await this.appwrite.database.listDocuments(environment.instituteCollectionId, [], 0, 50, 'name', '', '', '', 0, 0)
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
        await this.deleteTeam(institute.teamId)
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
        let team: Team = await this.appwrite.teams.create(name, ['*']) as Team
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
        let res: any = await this.appwrite.teams.list('', 10, 0, 'DESC')
        console.log(res)
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
        let team: any = await this.appwrite.teams.delete(id)
        console.log(team)
        resolve(team)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  private handleError(error: any): any {
    console.log(error)
    switch (error.message) {
      case 'Unauthorized':
        break;
      case 'Not Found':

        break;
      case 'Conflict':
        break;
      default:
        break;
    }
  }
}
