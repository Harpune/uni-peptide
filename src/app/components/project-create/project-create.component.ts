import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class CreateProjectComponent implements OnInit {
  projectForm!: FormGroup
  // TODO: Make maodel available here: Project AND Institute

  constructor(private appwriteService: AppwriteService,
    public dialogRef: MatDialogRef<CreateProjectComponent>,
    @Inject(MAT_DIALOG_DATA) public institute: Institute,
    private formBuilder: FormBuilder) {

  }

  ngOnInit(): void {
    // init form
    console.log('institute', this.institute)
    this.projectForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      date: [null],
    });
  }

  submit() {
    if (!this.projectForm.valid) {
      return;
    }

    // setup project
    let project: Project = this.projectForm.value as Project
    let now: Date = new Date()
    project.created = now.toISOString()
    project.updated = now.toISOString()
    project.subprojects = []
    project.$permissions = this.institute.$permissions
    project.$collection = environment.projectCollectionId

    // return new project
    this.dialogRef.close(project)
  }
}
