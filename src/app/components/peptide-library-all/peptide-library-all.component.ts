import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

@Component({
  selector: 'app-peptide-library-all',
  templateUrl: './peptide-library-all.component.html',
  styleUrls: ['./peptide-library-all.component.scss']
})
export class PeptideLibraryAllComponent implements OnInit {

  allPeptideLibraries: PeptideLibrary[] = []


  constructor(private appwriteService: AppwriteService,
    public dialogRef: MatDialogRef<PeptideLibraryAllComponent>,
    @Inject(MAT_DIALOG_DATA) public peptideLibraryIds: string[]) {
  }

  ngOnInit(): void {
    this.getData()
  }

  async getData() {
    await this.listAllPeptideLibraries()
  }


  async listAllPeptideLibraries() {
    try {
      this.allPeptideLibraries = await this.appwriteService.listPeptideLibraries()
    } catch (e) {
      console.log('Error listing peptide libraries')
    }
  }

  addPeptideLibrary() {
    this.dialogRef.close(this.peptideLibraryIds)
  }

  compareFn = this._compareFn.bind(this);
  _compareFn(a: PeptideLibrary, b: PeptideLibrary) {
    return a.$id === b.$id;
  }

}
