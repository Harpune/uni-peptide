import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { speedDialFabAnimations } from 'src/app/animations/fab-rotation.animations';
import { Account } from 'src/app/models/account';
import { Institute, PeptideLibrary, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { CreateProjectComponent } from '../project-create/project-create.component';
import { PeptideLibraryAllComponent } from '../peptide-library-all/peptide-library-all.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss'],
  animations: speedDialFabAnimations
})
export class ProjectComponent implements OnInit {
  private instituteId!: string
  private projectId!: string

  institute!: Institute
  project!: Project
  account!: Account
  isOwner: boolean = false
  peptideLibraries: PeptideLibrary[] = []

  isFavorite: boolean = false

  treeControl = new NestedTreeControl<Project>(node => node.subprojects)
  dataSource = new MatTreeNestedDataSource<Project>()
  hasChild = (_: number, node: Project) => !!node.subprojects && node.subprojects.length > 0

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.instituteId = params['instituteId']
      this.projectId = params['projectId']
      this.getData()
    })
  }

  async getData() {
    try {
      this.institute = await this.appwriteService.getInstitute(this.instituteId)
      this.project = await this.appwriteService.getProject(this.projectId)
      this.dataSource.data = this.project.subprojects

      this.account = await this.appwriteService.getAccount()

      this.isOwner = this.account.roles
        .filter(role => role.includes(this.institute.teamId))
        .some(role => role.includes('owner'))

      this.peptideLibraries = []
      if (this.project.peptideLibraryIds) {
        for await (const peptideLibrary of this.project.peptideLibraryIds.map(peptideLibraryId =>
          this.appwriteService.getPeptideLibrary(peptideLibraryId))) this.peptideLibraries.push(peptideLibrary)
      }

      this.checkIfFavorite()

    } catch (e) {
      console.log(e)
    }
  }

  showProject(project: Project) {
    console.log('Navigate to: ', 'institute/' + this.instituteId + '/project/' + project.$id)
    this.router.navigate(['institute/' + this.instituteId + '/project/' + project.$id])
  }

  async listAllPeptideLibraries() {
    const dialogRef = this.dialog.open(PeptideLibraryAllComponent, {
      data: this.project.peptideLibraryIds
    })

    dialogRef.afterClosed().subscribe((peptideLibrary: PeptideLibrary[]) => {
      // update ids
      this.project.peptideLibraryIds = peptideLibrary.map(it => it.$id)

      // save
      this.appwriteService.updateProject(this.project)
        .then(project => this.getData())
    })
  }

  deleteProject() {
    if (confirm('Wollen sie das Projekt inklusive Sub-Projekte wirklich löschen?')) {
      this.removeTeams(this.project)
      this.router.navigate(['../../',], { relativeTo: this.route })
    }
  }

  async removeTeams(project: Project) {
    // Remove current reference
    this.appwriteService.deleteProjectTeams(project)
      .then(res => console.log('Done: removeTeamsRekursive', project.name))

    // remove child reference
    project.subprojects?.forEach(project => this.removeTeams(project))

  }

  openProjectDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      data: this.institute
    })

    dialogRef.afterClosed().subscribe(project => {
      console.log('Created Project', project)
      if (project) {

        if (!this.project.subprojects) {
          this.project.subprojects = []
        }

        this.project.subprojects.push(project)
        this.appwriteService.updateProject(this.project)
          .then(() => this.getData())
      }
    })
  }

  showPeptide(peptideLibrary: PeptideLibrary) {
    // this.snackBar.open('Show everthing about ' + peptideLibrary.name, 'Ok', { duration: 2000 })
    this.router.navigate(['./peptide/' + peptideLibrary.$id], { relativeTo: this.route })
  }

  checkIfFavorite() {
    // project with insitute concatenated
    let projectKey = this.instituteId + ':' + this.projectId

    let fav_projects: string[] = this.account?.prefs?.fav_projects
    if (fav_projects) {
      this.isFavorite = fav_projects.includes(projectKey)
    } else {
      this.isFavorite = false
    }
  }

  toggleFavorite() {
    this.isFavorite = !this.isFavorite

    // project with insitute concatenated
    let projectKey = this.instituteId + ':' + this.projectId

    // exisiting favorites
    let fav_projects: string[] = this.account.prefs.fav_projects

    // make sure it exists
    if (!fav_projects) {
      fav_projects = []
    }

    // remove or add project id to account preferences
    if (this.isFavorite) {
      fav_projects.push(projectKey)
    } else {
      const index = fav_projects.indexOf(projectKey, 0);
      if (index > -1) {
        fav_projects.splice(index, 1);
      }
    }

    // update account preferences
    this.account.prefs.fav_projects = fav_projects
    this.appwriteService.updateAccountPrefs(this.account.prefs)
  }
}
