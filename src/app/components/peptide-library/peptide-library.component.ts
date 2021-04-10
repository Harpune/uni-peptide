import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { FilesPreviewComponent } from '../files-peptide-preview/files-peptide-preview.component';
import { CreatePeptideLibraryComponent } from '../peptide-library-create/peptide-library-create.component';

@Component({
  selector: 'app-peptide-library',
  templateUrl: './peptide-library.component.html',
  styleUrls: ['./peptide-library.component.scss'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({ height: '0px', minHeight: '0' })),
  //     state('expanded', style({ height: '*' })),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
  //   ]),
  // ],
})
export class PeptideLibraryComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  displayedPeptideColumns: string[] = ['name', 'organism', 'document']
  peptideData!: MatTableDataSource<PeptideLibrary>
  expandedElement!: PeptideLibrary | null

  constructor(private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    this.listPeptideLibraries()
  }

  private async listPeptideLibraries() {
    try {
      let peptideLibrary: PeptideLibrary[] = await this.appwriteService.listPeptideLibraries()
      this.peptideData = new MatTableDataSource(peptideLibrary)
      this.peptideData.paginator = this.paginator
      this.peptideData.sort = this.sort
    } catch (e) {
    }
  }

  addPeptideLibrary() {
    const dialogRef = this.dialog.open(CreatePeptideLibraryComponent, {
      data: ""
    })

    dialogRef.afterClosed().subscribe(data => {
      console.log('Created Peptide Libaray', data)
      this.listPeptideLibraries()
    })
  }

  async showPeptide(peptideLibrary: PeptideLibrary) {
    console.log("peptideLibrary", peptideLibrary)
    this.router.navigate([peptideLibrary.$id], { relativeTo: this.route })
  }

  async showDocuments(peptideLibrary: PeptideLibrary) {
    this.dialog.open(FilesPreviewComponent, {
      data: peptideLibrary
    })
  }

  async previewFiles(peptideLibrary: PeptideLibrary) {
    let files: string[] = []
    for await (const file of peptideLibrary.documentIds.map(documentId => this.appwriteService.getFilePreview(documentId))) {
      files.push(file)
    }
    window.open(files[0], "_blank");
    console.log('files', files)
  }

  async downloadFiles(peptideLibrary: PeptideLibrary) {
    let files: string[] = []
    for await (const file of peptideLibrary.documentIds.map(documentId => this.appwriteService.getFileDownload(documentId))) {
      files.push(file)
    }
    window.open(files[0], "_blank")
  }

  async viewFiles(peptideLibrary: PeptideLibrary) {
    let files: string[] = []
    for await (const file of peptideLibrary.documentIds.map(documentId => this.appwriteService.getFileView(documentId))) {
      files.push(file)
    }
    window.open(files[0], "_blank")
  }
}
