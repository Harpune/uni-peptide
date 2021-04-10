import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Institute, PeptideLibrary, Project } from 'src/app/models/institute';
import { Account } from 'src/app/models/account'
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import * as Chart from 'chart.js';
import { FileService } from 'src/app/services/file/file.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss']
})
export class ProjectDetailComponent implements OnInit {
  @ViewChild('myChart') chartCanvas!: any
  account!: Account

  instituteId!: string
  projectId!: string
  peptideId!: string

  institute!: Institute
  project!: Project
  peptideLibrary!: PeptideLibrary

  constructor(private appwriteService: AppwriteService,
    private fileService: FileService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
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

      let result = await this.fileService.getTextFile('6071907e75e16')
      // console.log('result', result)
      let X: number[] = []
      let Y: number[] = []
      result.split('\n').forEach(line => {
        let splittedLine = line.split(',')
        let x: number = +splittedLine[0]
        let y: number = +splittedLine[1]
        X.push(x)
        Y.push(y)
      })

      var chart = new Chart('myChart', {
        type: 'line',
        data: {
          labels: X,
          datasets: [
            {
              label: 'Wow',
              data: Y,
              backgroundColor: '#80bbcb55',
              borderColor: '#00597a',
            }
          ]
        }
      });

    } catch (e) {
      console.log(e)
    }
  }
}
