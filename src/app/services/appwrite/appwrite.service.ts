import { environment } from 'src/environments/environment'
import { Injectable } from '@angular/core';
import * as Appwrite from "appwrite";
import { Institute, Project } from 'src/app/models/institute';
import { Session } from 'src/app/models/session';
import { Account, AccountPreference as AccountPreference } from 'src/app/models/account';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Membership, Team } from 'src/app/models/team';
import { AppwriteError } from 'src/app/models/error';
import { Recovery } from 'src/app/models/recovery';

@Injectable({
  providedIn: 'root'
})
export class AppwriteService {
  public appwrite: Appwrite = new Appwrite()

  constructor(private snackBar: MatSnackBar) {
    // init appwrite
    this.appwrite
      .setEndpoint(environment.endpointURL)
      .setProject(environment.projectId)
  }

  isLoggedIn(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.getAccount()
        .then(_ => resolve(true))
        .catch(error => {
          this.handleError(error)
          resolve(false)
        })
    })
  }

  createAccount(name: string, email: string, password: string): Promise<Account> {
    return new Promise(async (resolve, reject) => {
      try {
        // create new account -> register
        console.log('Start create account', name, email)
        let account = await this.appwrite.account.create(email, password, name)
        console.log('End create account', account)
        resolve(account as Account)
      } catch (e) {
        this.handleError(e)
        reject(e?.code)
      }
    })
  }

  getAccount(): Promise<Account> {
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

  createVerification(): Promise<any> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        console.log('Start create verififcation')
        let res = await this.appwrite.account.createVerification(environment.url + '/verification')
        console.log('End create verififcation', res)
        resolve(res as any)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  updateVerification(userId: string, secret: string): Promise<any> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        console.log('Start update verififcation')
        let res = await this.appwrite.account.updateVerification(userId, secret)
        console.log('End update verififcation', res)
        resolve(res as any)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  createRecovery(email: string): Promise<Recovery> {
    return new Promise<Recovery>(async (resolve, reject) => {
      try {
        console.log('Start create recovery')
        let res = await this.appwrite.account.createRecovery(email, environment.url + '/recovery')
        console.log('End create recovery', res)
        resolve(res as Recovery)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  updateRecovery(userId: string, secret: string, password: string, passwordAgain: string,): Promise<any> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        console.log('Start update recovery')
        let res = await this.appwrite.account.updateRecovery(userId, secret, password, passwordAgain)
        console.log('End update recovery', res)
        resolve(res as any)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  updateAccountName(name: string): Promise<Account> {
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

  updateAccountEmail(email: string, password: string): Promise<Account> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start update email')
        let res = await this.appwrite.account.updateEmail(email, password)
        console.log('End update email', res)
        resolve(res as Account)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  updateAccountPassword(password: string, oldPassword: string): Promise<Account> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start update password')
        let res = await this.appwrite.account.updatePassword(password, oldPassword)
        console.log('End update password', res)
        resolve(res as Account)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  getAccountPrefs(): Promise<AccountPreference> {
    return new Promise<AccountPreference>(async (resolve, reject) => {
      try {
        console.log('Start get account preferences')
        let res = await this.appwrite.account.getPrefs()
        console.log('End get account preferences', res)
        resolve(res as AccountPreference)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  updateAccountPrefs(prefs: object): Promise<AccountPreference> {
    return new Promise<AccountPreference>(async (resolve, reject) => {
      try {
        console.log('Start update account preferences')
        let res = await this.appwrite.account.updatePrefs(prefs)
        console.log('End update account preferences', res)
        resolve(res as AccountPreference)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  deleteAccount(): Promise<any> {
    return new Promise<any>(async (resolve, reject) => {
      try {
        console.log('Start delete account')
        let res = await this.appwrite.account.delete()
        console.log('End delete account', res)
        resolve(res)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  createSession(email: string, password: string): Promise<object> {
    return new Promise<object>(async (resolve, reject) => {
      try {
        console.log('Start create session', email, password)
        let session = await this.appwrite.account.createSession(email, password)
        console.log('End create session', session)

        resolve(session)
      } catch (e) {
        this.handleError(e)
        reject(e?.code)
      }
    })
  }

  getSessions(): Promise<Session[]> {
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

  getCurrentSession(): Promise<Session> {
    return new Promise<Session>(async (resolve, reject) => {
      try {
        let sessions: Session[] = await this.getSessions()

        for (let i = 0; i < sessions.length; i++) {
          if (sessions[i].current) {
            resolve(sessions[i])
          }
        }
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  deleteSession(id: string): Promise<Account> {
    return new Promise<Account>(async (resolve, reject) => {
      try {
        console.log('Start delete session')
        let res = await this.appwrite.account.deleteSession(id)
        console.log('End delete session', res)
        resolve(res as Account)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  createTeam(name: string): Promise<Team> {
    return new Promise<Team>(async (resolve, reject) => {
      try {
        // owner
        let account: Account = await this.getAccount()
        let owner = 'owner'
        console.log('Owner', owner)

        // create team
        let team: Team = await this.appwrite.teams.create(name, [owner]) as Team
        console.log('Created Team', team)
        resolve(team)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  listTeams(): Promise<Team[]> {
    return new Promise<Team[]>(async (resolve, reject) => {
      try {
        console.log('Start list team')
        let res: any = await this.appwrite.teams.list('', 10, 0, 'DESC')
        console.log('End list Team', res)

        resolve(res?.teams as Team[])
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  getTeam(id: string): Promise<Team> {
    return new Promise<Team>(async (resolve, reject) => {
      try {
        console.log('Start get team', id)
        let res = await this.appwrite.teams.get(id)
        console.log('End get team', res)

        resolve(res as Team)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  deleteTeam(id: string): Promise<any> {
    return new Promise<Team>(async (resolve, reject) => {
      try {
        console.log('Delete team', id)
        let res = await this.appwrite.teams.delete(id) as Team
        resolve(res)
      } catch (e) {
        this.handleError(e)
        //TODO: must be reject but runs in 500-Error reject()
        reject()
      }
    })
  }

  getTeamMemberships(teamId: string): Promise<Membership[]> {
    return new Promise<Membership[]>(async (resolve, reject) => {
      try {
        console.log('Start get team-memberships', teamId)
        let res = await this.appwrite.teams.getMemberships(teamId)
        console.log('End get team-memberships', res)

        resolve(res as Membership[])
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  createMembership(teamId: string, email: string, name: string): Promise<Membership> {
    return new Promise<Membership>(async (resolve, reject) => {
      try {
        console.log('Start create membership', teamId, email, name)
        let res = await this.appwrite.teams.createMembership(teamId, email, ['member'], environment.url + '/invitation', name)
        console.log('End create membership', res)

        resolve(res as Membership)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  updateMembershipStatus(teamId: string, inviteId: string, userId: string, secret: string): Promise<Membership> {
    return new Promise<Membership>(async (resolve, reject) => {
      try {
        console.log('Start update membership', teamId, inviteId, userId, secret)
        let res = await this.appwrite.teams.updateMembershipStatus(teamId, inviteId, userId, secret)
        console.log('End update membership', res)

        resolve(res as Membership)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  deleteMembershipStatus(teamId: string, inviteId: string): Promise<Membership> {
    return new Promise<Membership>(async (resolve, reject) => {
      try {
        console.log('Start delete membership', teamId, inviteId,)
        let res = await this.appwrite.teams.deleteMembership(teamId, inviteId)
        console.log('End delete membership', res)

        resolve(res as Membership)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  createInstitute(data: any): Promise<Institute> {
    return new Promise<Institute>(async (resolve, reject) => {
      try {
        console.log("Create Institut", data)

        // owner
        let account: Account = await this.getAccount()
        let currentUser = 'user:' + account.$id

        // team reference
        let team: Team = await this.createTeam(data?.name)
        data.teamId = team.$id
        let currentTeam = 'team:' + team.$id

        // create institute institute
        let institute: Institute = await this.appwrite.database.createDocument(environment.instituteCollectionId, data, [currentUser, currentTeam], [currentUser, currentTeam]) as Institute
        console.log('Created Institute', institute)


        resolve(institute)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  listInstitutes(): Promise<Institute[]> {
    return new Promise<Institute[]>(async (resolve, reject) => {
      try {
        console.log('Start list institute')
        let res = await this.appwrite.database.listDocuments(environment.instituteCollectionId);
        console.log('End list institute', res)

        let institutes: Institute[] = (res as any)['documents'] as Institute[]
        resolve(institutes)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }

    })
  }

  getInstitute(id: string): Promise<Institute> {
    return new Promise<Institute>(async (resolve, reject) => {
      try {
        console.log('Start get institute', id)
        let res = await this.appwrite.database.getDocument(environment.instituteCollectionId, id)
        console.log('End get institute', res)
        resolve(res as Institute)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  updateInstitute(institute: Institute): Promise<Institute> {
    return new Promise<Institute>(async (resolve, reject) => {
      try {
        console.log('Start update institute', institute)
        let res = await this.appwrite.database.updateDocument(environment.instituteCollectionId, institute.$id, institute, institute.$permissions.read, institute.$permissions.write)
        console.log('End update institute', res)
        resolve(res as Institute)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  deleteInstitute(institute: Institute): Promise<object> {
    return new Promise(async (resolve, reject) => {
      try {
        console.log('Delete institute', institute)
        // delete team reference
        await this.deleteTeam(institute.teamId)

        // delete institute
        let res = await this.appwrite.database.deleteDocument(environment.instituteCollectionId, institute.$id)
        resolve(res)
      } catch (e) {
        this.handleError(e)
        reject()
      }
    })
  }

  createProject(data: any, instituteId: string): Promise<Project> {
    return new Promise<Project>(async (resolve, reject) => {
      try {
        console.log('Start add project')

        // owner
        let account: Account = await this.getAccount()
        let current = 'user:' + account.$id

        console.log('current', current)

        // create project
        let res = await this.appwrite.database.createDocument(environment.projectCollectionId, data, [current], [current], '', '', '')
        let project: Project = res as Project

        // add project to institute
        let institute = await this.getInstitute(instituteId)
        if (!institute.projects) {
          institute.projects = []
        }
        institute.projects.push(project)
        console.log('institute.projectIds', institute.projects)
        institute = await this.updateInstitute(institute)

        console.log('End add project', res, institute)
        resolve(res as Project)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  getProject(id: string): Promise<Project> {
    return new Promise<Project>(async (resolve, reject) => {
      try {
        console.log('Start get project', id)
        let res = await this.appwrite.database.getDocument(environment.projectCollectionId, id)
        console.log('End get Project', res)
        resolve(res as Project)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  updateProject(project: Project): Promise<Project> {
    return new Promise<Project>(async (resolve, reject) => {
      try {
        console.log('Start update project', project)
        let res = await this.appwrite.database.updateDocument(environment.projectCollectionId, project.$id, project, project.$permissions.read, project.$permissions.write)
        console.log('End update Project', res)
        resolve(res as Project)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  // better remove team reference
  deleteProject(id: string): Promise<Project> {
    return new Promise<Project>(async (resolve, reject) => {
      try {
        console.log('Start delete project', id)
        let res = await this.appwrite.database.deleteDocument(environment.projectCollectionId, id)
        console.log('End delete Project', res)
        resolve(res as Project)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  deleteProjectTeams(project: Project): Promise<Project> {
    return new Promise<Project>(async (resolve, reject) => {
      try {
        console.log('Start delete project (team memberships)', project)
        let res = await this.appwrite.database.deleteDocument(environment.projectCollectionId, project.$id)
        // let res = await this.appwrite.database.updateDocument(environment.projectCollectionId, project.$id, project, [], [])
        console.log('End delete Project (team memberships)', res)
        resolve(res as Project)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  uploadFile(file: File, ids: string[] = ["*"]): Promise<object> {
    return new Promise<object>(async (resolve, reject) => {
      try {

        console.log('Start upload file', file)
        let res = await this.appwrite.storage.createFile(file, ids, ids)
        console.log('End upload file', file)
        resolve(res)
      } catch (e) {
        this.handleError(e)
        reject(e)
      }
    })
  }

  private handleError(error: AppwriteError): any {
    console.log('Error', error)
    if (!error) {
      console.log('Could not handle error!')
      return;
    }
    switch (error.code) {
      case 401:
        break;
      case 404:

        break;
      case 409:
        this.snackBar.open('Es wurde bereits ein Account mit dieser E-Mail Adresse erstellt', 'Ok', { duration: 2000 })
        break;
      default:
        break;
    }
  }
}
