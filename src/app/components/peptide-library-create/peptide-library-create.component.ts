import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AppwriteFile } from 'src/app/models/file';
import { PeptideLibrary } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

@Component({
  selector: 'app-peptide-library-create',
  templateUrl: './peptide-library-create.component.html',
  styleUrls: ['./peptide-library-create.component.scss']
})
export class CreatePeptideLibraryComponent implements OnInit {
  peptideForm!: FormGroup

  files: File[] = []

  constructor(private appwriteService: AppwriteService,
    public dialogRef: MatDialogRef<CreatePeptideLibraryComponent>,
    private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    this.peptideForm = this.formBuilder.group({
      name: [null, Validators.required],
      organism: [null, Validators.required],
      description: [null]
    });
  }

  async submit() {
    if (!this.peptideForm.valid) {
      return;
    }

    try {
      let appwriteFiles: AppwriteFile[] = []

      // get files
      if (this.files) {
        for await (const appwriteFile of this.files.map(file => this.appwriteService.uploadFile(file))) {
          console.log('Created file', appwriteFile)
          appwriteFiles.push(appwriteFile)
        }
      }

      // update data
      let data = this.peptideForm.value as PeptideLibrary
      data.documentIds = appwriteFiles.map(appwriteFile => appwriteFile.$id)
      console.log('DATA', data)

      // create document
      let peptideLibrary: PeptideLibrary = await this.appwriteService.createPeptideLibrary(data)
      this.snackbar.open('Das Peptid ' + peptideLibrary.name + ' wurde zur Bibliothek hinzugefügt', 'Ok', { duration: 2000 })
    } catch (e) {
      console.log('Error create PeptideLibrary', e)
      this.snackbar.open('Das Peptid konnte nicht in die Bibliothek eingeflegt werden.', 'Ok', { duration: 2000 })
    } finally {
      this.dialogRef.close()
    }
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
      // this.snackBar.open('Es wurden keine Dateien angefügt', 'Ok', { duration: 2000 });
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
