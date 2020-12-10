import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Institute } from 'src/app/models/institute';

@Component({
  selector: 'app-institute-create',
  templateUrl: './institute-create.component.html',
  styleUrls: ['./institute-create.component.scss']
})
export class CreateInstituteComponent implements OnInit {
  instituteForm!: FormGroup


  constructor(public dialogRef: MatDialogRef<CreateInstituteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Institute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // init form
    this.instituteForm = this.formBuilder.group({
      name: [null, Validators.required],
      organisation: [null],
      address: [null],
    });
  }

  submit() {
    if (!this.instituteForm.valid) {
      return;
    }

    this.dialogRef.close(this.data);
  }

}
