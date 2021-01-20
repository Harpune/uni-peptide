import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { speedDialFabAnimations } from 'src/app/animations/fab-rotation.animations';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { MiniFab } from '../institute-details/institute-details.component';
import { SubProjectCreateComponent } from '../project-sub-create/project-sub-create.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';

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

  miniFabButtons: MiniFab[] = []
  fabTogglerState: string = 'inactive';
  fabButtons: MiniFab[] = [
    { icon: 'lightbulb_outline', label: 'Sub-Projekt', id: 'subproject' },
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
      console.log('project', this.project)
      this.dataSource.data = this.project.subprojects
    } catch (e) {
      console.log(e)
    }
  }

  showProject(project: Project) {
    console.log('Navigate to: ', 'institute/' + this.instituteId + '/project/' + project.$id)
    this.router.navigate(['institute/' + this.instituteId + '/project/' + project.$id])
  }

  toggleMiniFabs() {
    this.miniFabButtons.length ? this.hideMiniFabs() : this.showMiniFabs();
  }

  showMiniFabs() {
    this.fabTogglerState = 'active'
    this.miniFabButtons = this.fabButtons
  }

  hideMiniFabs() {
    this.fabTogglerState = 'inactive'
    this.miniFabButtons = []
  }

  miniFabClicked(miniFab: MiniFab) {
    switch (miniFab.id) {
      case 'subproject':
        this.openSubProjectDialog()
        break;
      case 'upload':
        this.openFilesDialog()
        break;
      case 'delete':
        this.deleteProject();
        break;
    }
  }

  deleteProject() {
    if (confirm('Wollen sie das Projekt inklusive Sub-Projekte wirklich löschen?')) {
      this.removeTeams(this.project)
    }
  }

  removeTeams(project: Project) {
    // Remove current reference
    this.appwriteService.deleteProjectTeams(project)
      .then(res => console.log('Done: removeTeamsRekursive', project.name))

    // remove child reference
    project.subprojects?.forEach(project => this.removeTeams(project))

  }

  openSubProjectDialog() {
    const dialogRef = this.dialog.open(SubProjectCreateComponent, {
      data: {
        project: this.project,
        institute: this.institute
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      console.log('Res Dialog', res)
      this.getData()
      this.hideMiniFabs()
    })
  }

  openFilesDialog() {
    const dialogRef = this.dialog.open(UploadFilesComponent, {
      data: {
        project: this.project,
        institute: this.institute
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      console.log('Res Dialog', res)
      this.getData()
      this.hideMiniFabs()
    })
  }
}
