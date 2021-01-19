import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { SubProjectCreateComponent } from '../project-sub-create/project-sub-create.component';

@Component({
  selector: 'app-upload-files',
  templateUrl: './upload-files.component.html',
  styleUrls: ['./upload-files.component.scss']
})
export class UploadFilesComponent {


  files: File[] = []

  constructor(private appwriteService: AppwriteService,
    @Inject(MAT_DIALOG_DATA) public data: { project: Project, institute: Institute },
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<SubProjectCreateComponent>) {
  }


  onSelect(event: any) {
    console.log('onSelect', event)
    this.files.push(...event.addedFiles)
    console.log('files', this.files)
  }

  onRemove(event: any) {
    console.log('onRemove', event)
    this.files.splice(this.files.indexOf(event), 1)
    console.log('files', this.files)
  }

  async uploadFiles() {
    if (this.files.length <= 0) {
      this.snackBar.open('Es wurden keine Dateien angefügt', 'Ok', { duration: 2000 });
    } else {
      this.files.map(async (file) => {
        try {
          let accessId = 'team:' + this.data.institute.teamId
          let res = await this.appwriteService.uploadFile(file, [accessId])
            .finally(() => this.dialogRef.close(this.data))
          console.log('File uploaded', res)
        } catch (e) {
          console.log('Error uploading file', e)
        } finally {
          this.files = []
        }
      })
    }
  }
}
