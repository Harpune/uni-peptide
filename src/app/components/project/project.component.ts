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
import { MiniFab } from '../institute-details/institute-details.component';
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

  miniFabButtons: MiniFab[] = []
  fabTogglerState: string = 'inactive';
  fabButtons: MiniFab[] = [
    { icon: 'attach_file', label: 'Hochladen', id: 'upload' },
    { icon: 'delete', label: 'Löschen', id: 'delete', color: 'warn' }]

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
      console.log('paramas', params)
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

  // openFilesDialog() {
  //   const dialogRef = this.dialog.open(UploadFilesComponent, {
  //     data: {
  //       project: this.project,
  //       institute: this.institute
  //     }
  //   })
  //   dialogRef.afterClosed().subscribe(res => {
  //     console.log('Res Dialog', res)
  //     this.getData()
  //     this.hideMiniFabs()
  //   })
  // }

  showPeptide(peptideLibrary: PeptideLibrary) {
    this.snackBar.open('Show everthing about ' + peptideLibrary.name, 'Ok', { duration: 2000 })
  }
}
