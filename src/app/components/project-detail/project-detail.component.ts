import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Institute, PeptideLibrary, Project } from 'src/app/models/institute';
import { Account } from 'src/app/models/account'
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {

  account!: Account

  instituteId!: string
  projectId!: string
  peptideId!: string

  institute!: Institute
  project!: Project
  peptideLibrary!: PeptideLibrary

  constructor(private appwriteService: AppwriteService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      console.log('paramas', params)
      this.instituteId = params['instituteId']
      this.projectId = params['projectId']
      this.peptideId = params['peptideId']
      this.getData()
    })
  }

  async getData() {
    try {
      this.institute = await this.appwriteService.getInstitute(this.instituteId)
      this.project = await this.appwriteService.getProject(this.projectId)
      this.peptideLibrary = await this.appwriteService.getPeptideLibrary(this.peptideId)
      this.account = await this.appwriteService.getAccount()
    } catch (e) {
      console.log(e)
    }
  }
}
