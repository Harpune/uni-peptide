import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Institute } from 'src/app/models/institute';
import { Membership } from 'src/app/models/team';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-institute-create-member',
  templateUrl: './institute-create-member.component.html',
  styleUrls: ['./institute-create-member.component.scss']
})
export class CreateInstituteMemberComponent implements OnInit {
  membershipForm!: FormGroup

  constructor(private appwriteService: AppwriteService,
    public dialogRef: MatDialogRef<CreateInstituteMemberComponent>,
    @Inject(MAT_DIALOG_DATA) public institute: Institute,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    console.log('institute', this.institute)
    this.membershipForm = this.formBuilder.group({
      email: [null, Validators.required],
      name: [null]
    });
  }

  submit() {
    if (!this.membershipForm.valid) {
      return;
    }

    let email: string = this.membershipForm.controls['email'].value
    let name: string = this.membershipForm.controls['name'] ? this.membershipForm.controls['name'].value : ''

    this.appwriteService.createMembership(this.institute.teamId, email, name)
      .finally(() => this.dialogRef.close(this.institute))
  }

}
