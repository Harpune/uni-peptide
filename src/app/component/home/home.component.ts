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

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  displayedColumns: string[] = ['teamId', 'name', 'organisation', 'address']

  dataSource!: MatTableDataSource<Institute>
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
    this.appwriteService.listInstitutesOfCurrent()
      .then((institutes: Institute[]) => {
        this.dataSource = new MatTableDataSource(institutes)
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      })
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
