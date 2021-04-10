import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppwriteFile } from 'src/app/models/file';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { UploadFilesComponent } from '../files-upload/files-upload.component';

@Component({
  selector: 'app-files-peptide-preview',
  templateUrl: './files-peptide-preview.component.html',
  styleUrls: ['./files-peptide-preview.component.scss']
})
export class FilesPreviewComponent implements OnInit {

  peptideLibrary!: PeptideLibrary
  files: AppwriteFile[] = []

  constructor(private appwriteService: AppwriteService,
    @Inject(MAT_DIALOG_DATA) public data: PeptideLibrary,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<FilesPreviewComponent>) {
    this.peptideLibrary = data
  }

  ngOnInit(): void {
    this.getFiles()
  }

  async getFiles() {
    this.files = []
    if (this.peptideLibrary.documentIds?.length > 0) {
      for await (const file of this.peptideLibrary.documentIds.map(documentId => this.appwriteService.getFile(documentId))) this.files.push(file)
    }
  }

  async viewFile(file: AppwriteFile) {
    let fileUrl = await this.appwriteService.getFileView(file.$id)
    window.open(fileUrl, "_blank")

    this.dialogRef.close()
  }

  async downloadFile(file: AppwriteFile) {
    let fileUrl = await this.appwriteService.getFileDownload(file.$id)
    window.open(fileUrl, "_blank")

    this.dialogRef.close()
  }

  async deleteFile(file: AppwriteFile) {
    if (confirm("Wollen Sie die Datei wirklich löschen?")) {
      const index = this.peptideLibrary.documentIds.indexOf(file.$id, 0)
      if (index > -1) {
        // remove file from peptideLibrary and update
        this.peptideLibrary.documentIds.splice(index, 1)
        this.appwriteService.updatePeptideLibrary(this.peptideLibrary)
        this.getFiles()
      }
    }
  }

  async uploadDocument() {
    // TODO get team:id to add to files upload to each peptide
    const dialogRef = this.dialog.open(UploadFilesComponent, {
      data: { permissions: ['*'] }
    })

    dialogRef.afterClosed().subscribe(files => {
      console.log("Uploaded files", files)
      if (files) {
        // parse t
        let appwriteFiles: AppwriteFile[] = files as AppwriteFile[]

        // add if undefined
        if (!this.peptideLibrary.documentIds) {
          this.peptideLibrary.documentIds = []
        }

        this.peptideLibrary.documentIds.push(...appwriteFiles.map(f => f.$id))
        this.appwriteService.updatePeptideLibrary(this.peptideLibrary)
      }
      this.getFiles()
    })
  }
}
