import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

import { Observable } from 'rxjs/internal/Observable';
import { map, startWith } from 'rxjs/operators';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-peptide-library-all',
  templateUrl: './peptide-library-all.component.html',
  styleUrls: ['./peptide-library-all.component.scss']
})
export class PeptideLibraryAllComponent implements OnInit {
  @ViewChild('auto') matAutocomplete!: MatAutocomplete
  @ViewChild('peptideLibraryInput') peptideLibraryInput!: ElementRef<HTMLInputElement>;

  allPeptideLibraries: PeptideLibrary[] = []
  selectedPeptideLibraries: PeptideLibrary[] = []

  selectable: boolean = true
  removable: boolean = true
  peptideLibraryCtrl = new FormControl()
  filteredPeptideLibraries!: Observable<PeptideLibrary[]>
  separatorKeysCodes: number[] = [ENTER, COMMA]

  constructor(private appwriteService: AppwriteService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<PeptideLibraryAllComponent>,
    @Inject(MAT_DIALOG_DATA) public peptideLibraryIds: string[]) {
  }

  ngOnInit(): void {

    this.getData()

    this.filteredPeptideLibraries = this.peptideLibraryCtrl.valueChanges.pipe(
      startWith(""),
      map((value: string) => value ? this._filter(value) : this.allPeptideLibraries.slice())
    )
  }

  async getData() {
    await this.listAllPeptideLibraries()
    await this.listSelectedPeptideLibraries()

  }

  async listAllPeptideLibraries() {
    try {
      this.allPeptideLibraries = await this.appwriteService.listPeptideLibraries()
    } catch (e) {
      console.log('Error listing peptide libraries', e)
    }
  }

  async listSelectedPeptideLibraries() {
    if (!this.peptideLibraryIds) {
      this.peptideLibraryIds = []
    }
    this.selectedPeptideLibraries = this.allPeptideLibraries.filter(peptideLibrary => this.peptideLibraryIds.includes(peptideLibrary.$id))
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    let selected: PeptideLibrary = event.option.value
    if (!this.selectedPeptideLibraries.includes(selected)) {
      this.selectedPeptideLibraries.push(event.option.value)
    } else {
      this.snackBar.open(selected.name + ' wurde bereits hinzugefügt.', 'Ok', { duration: 2000 })
    }
    this.peptideLibraryInput.nativeElement.value = ''
    this.peptideLibraryCtrl.setValue(null)
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
    let filtered: PeptideLibrary[] = this._filter(value)

    if (filtered.length === 0) {
      this.snackBar.open(`Es wurden keine Peptide mit dem Suchbegriff '${value}' gefunden.`, 'Ok', { duration: 2000 })
    } else if (filtered.length === 1) {
      this.selectedPeptideLibraries.push(...filtered)
      this.peptideLibraryInput.nativeElement.value = ''
      this.peptideLibraryCtrl.setValue(null)
    } else {
      this.snackBar.open(`Es wurden mehrere Peptide mit dem Suchbegriff '${value}' gefunden. Bitte wählen Sie nur eines aus.`, 'Ok', { duration: 2000 })
    }

  }

  remove(peptideLibrary: PeptideLibrary): void {
    const index = this.selectedPeptideLibraries.indexOf(peptideLibrary);

    if (index >= 0) {
      this.selectedPeptideLibraries.splice(index, 1);
    }
  }

  save() {
    this.dialogRef.close(this.selectedPeptideLibraries)
  }

  private _filter(value: string): PeptideLibrary[] {

    let all: PeptideLibrary[] = this.allPeptideLibraries.slice()
    if (typeof value === 'string') { // returns object if new item is added
      const filterValue = value ? value.toLowerCase() : ''

      // filter by user input
      all = all.filter(peptideLibrary =>
        peptideLibrary.name.toLowerCase().indexOf(filterValue) >= 0
        || peptideLibrary.organism.toLowerCase().indexOf(filterValue) >= 0)
    }


    return all.filter(peptideLibrary => !this.selectedPeptideLibraries.includes(peptideLibrary))
  }

  compareFn = this._compareFn.bind(this);
  _compareFn(a: PeptideLibrary, b: PeptideLibrary) {
    return a.$id === b.$id;
  }

}
