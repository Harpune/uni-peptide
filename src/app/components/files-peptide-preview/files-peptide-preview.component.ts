import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppwriteFile } from 'src/app/models/file';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

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
    public dialogRef: MatDialogRef<FilesPreviewComponent>) {
    this.peptideLibrary = data
  }

  ngOnInit(): void {
    this.getFiles()
  }

  async getFiles() {
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
}
