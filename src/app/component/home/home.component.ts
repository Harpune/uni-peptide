import { HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Institute } from 'src/app/models/institute';
import { Team } from 'src/app/models/team';
import { Account } from 'src/app/models/account';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  displayedColumns: string[] = ['teamId', 'name', 'organisation', 'address', 'delete']
  
  dataSource!: MatTableDataSource<Institute>;
  breakpoint!: number;
  constructor(private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= environment.mobileSize) ? 1 : 2

    this.getInstitutesOfUser()
  }

  private async getInstitutesOfUser() {
    let user: Account = await this.appwriteService.getAccount()
    console.log(user)
    this.appwriteService.listInstitutes()
      .then((institutes: Institute[]) => {
        this.dataSource = new MatTableDataSource(institutes)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= environment.mobileSize) ? 1 : 2
  }

}
