import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  private instituteId!: string
  private projectId!: string

  institute!: Institute
  project!: Project

  files: File[] = [];

  constructor(private route: ActivatedRoute,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    const instituteId = this.route.snapshot.paramMap.get('instituteId')
    this.instituteId = instituteId ? instituteId : ''
    const projectId = this.route.snapshot.paramMap.get('projectId')
    this.projectId = projectId ? projectId : ''

    this.getData()
  }

  async getData() {
    try {
      this.institute = await this.appwriteService.getInstitute(this.instituteId)
      this.project = await this.appwriteService.getProject(this.projectId)

      console.log("asd", this.institute, this.project)
    } catch (e) {
      console.log(e)
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
    this.files.map(async (file) => {
      try {
        let res = await this.appwriteService.uploadFile(file);
        console.log('File uploaded', res)
      } catch (e) {
        console.log('Error uploading file', e)
      } finally {
        this.files = []
      }
    })
  }

}
