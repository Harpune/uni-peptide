import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
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
  fabButtons: MiniFab[] = [{ icon: 'lightbulb_outline', label: 'Sub-Projekt', id: 'subproject' },
  { icon: 'attach_file', label: 'Hochladen', id: 'upload' }]

  constructor(private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    const instituteId = this.route.snapshot.paramMap.get('instituteId')
    this.instituteId = instituteId ? instituteId : ''
    const projectId = this.route.snapshot.paramMap.get('projectId')
    this.projectId = projectId ? projectId : ''

    this.getData()
  }

  async getData() {
    try {
      this.institute = await this.appwriteService.getInstitute(this.instituteId)
      this.project = await this.appwriteService.getProject(this.projectId)
      console.log('Projekt', this.project)
      this.subprojects = this.project.subprojects as Project[]
      console.log('subprojects', this.subprojects)
    } catch (e) {
      console.log(e)
    }
  }

  toggleMiniFabs() {
    if (this.miniFabsShown) {
      this.miniFabButtons = []
    } else {
      this.miniFabButtons = this.fabButtons
    }
    this.miniFabsShown = !this.miniFabsShown
  }

  miniFabClicked(miniFab: MiniFab) {
    switch (miniFab.id) {
      case 'subproject':
        this.openSubProjectDialog()
        // this.snackBar.open('Comming soon. Stay hyped!', 'Go', { duration: 2000 })
        break;
      case 'upload':
        this.openFilesDialog()
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
      this.toggleMiniFabs()
    })
  }

  openFilesDialog() {
  }
}
