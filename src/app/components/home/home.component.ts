import { HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateInstituteComponent } from '../institute-create/institute-create.component';

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
    private dialog: MatDialog,
    private router: Router) {
  }

  ngOnInit(): void {
    this.setBreakpoints(window.innerWidth)
    this.listInstitutes()
  }

  public showInstitute(institute: Institute) {
    this.router.navigate(['institute/' + institute.$id])
  }

  public leaveInstitute(institute: Institute) {
    console.log('ASAS', institute)
  }

  private async listInstitutes() {
    try {
      let institutes: Institute[] = await this.appwriteService.listInstitutes()
      this.instituteData = new MatTableDataSource(institutes)
      this.instituteData.paginator = this.paginator
      this.instituteData.sort = this.sort
    } catch (e) {
    }
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(CreateInstituteComponent, {
      data: {
        name: null,
        organisation: null,
        address: null
      }
    })

    dialogRef.afterClosed().subscribe(res => this.listInstitutes())
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
