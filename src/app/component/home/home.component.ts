import { HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Institute } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';
import { NestedTreeControl } from '@angular/cdk/tree';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  displayedInstituteColumns: string[] = ['teamId', 'name', 'organisation', 'address']
  displayedUserColumns: string[] = ['name', 'email']

  instituteData!: MatTableDataSource<Institute>

  breakpoint!: number
  treeControl!: any

  constructor(private appwriteService: AppwriteService,
    private router: Router) {
  }

  ngOnInit(): void {
    this.setBreakpoints(window.innerWidth)
    this.getInstitutesOfUser()
  }

  public showInstitute(institute: Institute) {
    this.router.navigate(['institute/' + institute.$id])
  }

  public leaveInstitute(institute: Institute) {
    console.log('ASAS', institute)
  }

  private async getInstitutesOfUser() {
    try {
      let teams = await this.appwriteService.listTeams()
      console.log('teams', teams)
      let teamIdsFilter: string[] = teams
        .map(team => 'teamId=' + team.$id)
      console.log('teamIdsFilter', teamIdsFilter)
      let institutes: Institute[] = await this.appwriteService.filterInstitutes(teamIdsFilter)
      console.log('institutes', institutes)
      this.instituteData = new MatTableDataSource(institutes)
      this.instituteData.paginator = this.paginator
      this.instituteData.sort = this.sort

    } catch (e) {
    }
  }

  setBreakpoints(width: number) {
    if (width <= environment.mobileSize) {
      this.breakpoint = 1
    } else if (width <= environment.tabletSize) {
      this.breakpoint = 2
    } else if (width <= environment.desktopSize) {
      this.breakpoint = 3
    } else {
      this.breakpoint = 4
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.setBreakpoints(event.target.innerWidth)
  }
}
