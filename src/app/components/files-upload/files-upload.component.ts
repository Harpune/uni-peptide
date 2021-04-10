import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppwriteFile } from 'src/app/models/file';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

@Component({
  selector: 'app-files-upload',
  templateUrl: './files-upload.component.html',
  styleUrls: ['./files-upload.component.scss']
})
export class UploadFilesComponent {
  files: File[] = []
  permissions: string[] = ['*']

  constructor(private appwriteService: AppwriteService,
    @Inject(MAT_DIALOG_DATA) public data: { permissions: string[] },
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<UploadFilesComponent>) {
    console.log('UploadFilesComponent', 'data', data);
    this.permissions = data.permissions ? data.permissions : ['*']

  }

  // add file to list
  onSelect(event: any) {
    console.log('onSelect', event)
    this.files.push(...event.addedFiles)
    console.log('files', this.files)
  }

  // Remove file from list
  onRemove(event: any) {
    console.log('onRemove', event)
    this.files.splice(this.files.indexOf(event), 1)
    console.log('files', this.files)
  }

  // upload file return with list of file ids
  async uploadFiles() {
    if (this.files.length <= 0) {
      this.snackBar.open('Es wurden keine Dateien angefügt', 'Ok', { duration: 2000 });
    } else {
      // save ids for later reference
      let appwriteFiles: AppwriteFile[] = []

      // upload each file
      try {
        for await (const file of this.files.map(f => this.appwriteService.uploadFile(f, this.permissions))) {
          appwriteFiles.push(file)
        }
      } catch (e) {
        console.log('Error uploading file', e)
      }

      // close dialog
      console.log("appwriteFiles", appwriteFiles)
      this.dialogRef.close(appwriteFiles)
    }
  }
}
