import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { ActivatedRoute, Router } from '@angular/router';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { MiniFab } from '../institute-details/institute-details.component';
import { SubProjectCreateComponent } from '../project-sub-create/project-sub-create.component';
import { UploadFilesComponent } from '../upload-files/upload-files.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  private instituteId!: string
  private projectId!: string

  institute!: Institute
  project!: Project
  subprojects!: Project[]

  miniFabButtons: MiniFab[] = []
  miniFabsShown: boolean = false;
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
    if (this.miniFabsShown) {
      this.miniFabButtons = []
    } else {
      this.miniFabButtons = this.fabButtons
    }
    this.miniFabsShown = !this.miniFabsShown
  }

  hideMiniFabs() {
    this.miniFabButtons = []
    this.miniFabsShown = false
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
        this.snackBar.open('Comming soon. Stay hyped!', 'Go', { duration: 2000 })
        break;
    }
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
