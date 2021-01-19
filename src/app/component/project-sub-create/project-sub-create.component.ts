import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-project-sub-create',
  templateUrl: './project-sub-create.component.html',
  styleUrls: ['./project-sub-create.component.scss']
})
export class SubProjectCreateComponent implements OnInit {
  subProjectForm!: FormGroup


  constructor(private appwriteService: AppwriteService,
    @Inject(MAT_DIALOG_DATA) public data: { project: Project, institute: Institute },
    public dialogRef: MatDialogRef<SubProjectCreateComponent>,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // init form
    console.log('data', this.data)
    this.subProjectForm = this.formBuilder.group({
      name: [null, Validators.required],
      description: [null],
      date: [null],
    });
  }

  submit() {
    if (!this.subProjectForm.valid) {
      return;
    }

    let subproject: Project = this.subProjectForm.value as Project
    let now: Date = new Date()
    subproject.created = now.toISOString()
    subproject.updated = now.toISOString()
    subproject.subprojects = []
    subproject.$permissions = this.data.institute.$permissions
    subproject.$collection = environment.projectCollectionId

    if (!this.data.project.subprojects) {
      this.data.project.subprojects = []
    }

    this.data.project.subprojects.push(subproject)

    this.appwriteService.updateProject(this.data.project)
      .finally(() => this.dialogRef.close(this.data))
  }

}
