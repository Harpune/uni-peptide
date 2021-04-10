import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AppwriteFile } from 'src/app/models/file';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { UploadFilesComponent } from '../files-upload/files-upload.component';

@Component({
  selector: 'app-peptide-detail',
  templateUrl: './peptide-detail.component.html',
  styleUrls: ['./peptide-detail.component.scss']
})
export class PeptideDetailComponent implements OnInit {

  peptideId!: string
  peptideLibrary!: PeptideLibrary
  appwriteFileUrls = new Map<string, string>()
  window = window


  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.peptideId = params['peptideId']
      this.getData()
    })
  }

  async getData() {
    try {
      this.peptideLibrary = await this.appwriteService.getPeptideLibrary(this.peptideId)
      console.log('peptideLibrary', this.peptideLibrary)

      this.peptideLibrary.documentIds.forEach(async (id) => {
        let appwriteFile = await this.appwriteService.getFile(id)
        let url: string = await this.appwriteService.getFileView(id)
        this.appwriteFileUrls.set(url, appwriteFile.mimeType)
      })
    } catch (e) {
      console.log('Exception getting peptide library or its files', e)
    }
  }

  openFileUpload() {
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
      this.getData()
    })
  }
}
