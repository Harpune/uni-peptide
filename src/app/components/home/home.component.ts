import { HostListener, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Institute, Project } from 'src/app/models/institute';
import { Account } from 'src/app/models/account';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateInstituteComponent } from '../institute-create/institute-create.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { runInThisContext } from 'vm';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('institutePaginator', { read: MatPaginator }) institutePaginator!: MatPaginator;
  @ViewChild('instituteSort') instituteSort!: MatSort;
  @ViewChild('projectSort') projectSort!: MatSort;

  account!: Account
  institutes!: Institute[]
  projects!: Project[]
  instituteProjectList!: [string, string][]

  instituteData!: MatTableDataSource<Institute>
  projectData!: MatTableDataSource<Project>

  displayedInstituteColumns: string[] = ['name', 'organisation', 'address']
  displayedProjectColumns: string[] = ['name', 'description']
  displayedUserColumns: string[] = ['name', 'email']

  breakpoint!: number
  treeControl!: any

  constructor(private appwriteService: AppwriteService,
    private breakpointObserver: BreakpointObserver,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router) {

    breakpointObserver.observe([
      Breakpoints.Medium,
      Breakpoints.Large
    ]).subscribe(result => {
      if (result.matches) {
        console.log("HALLO!", result)
      }
    });
  }

  ngOnInit(): void {
    this.setBreakpoints(window.innerWidth)
    this.listInstitutes()
    this.getAccount()
  }

  public showInstitute(institute: Institute) {
    this.router.navigate(['institute/' + institute.$id])
  }

  public showProject(project: Project) {
    let ids: [string, string] | undefined = this.instituteProjectList.find(instituteProject => instituteProject[1] === project.$id)

    if (ids) {
      this.router.navigate(['institute/' + ids[0] + '/project/' + ids[1]])
    } else {
      this.snackBar.open('Das Institut des Projekts konnte nicht gefunden werden.')
    }
  }

  public leaveInstitute(institute: Institute) {
    console.log('ASAS', institute)
  }

  private async listInstitutes() {
    try {
      this.institutes = await this.appwriteService.listInstitutes()
      this.instituteData = new MatTableDataSource(this.institutes)
      this.instituteData.paginator = this.institutePaginator
      this.instituteData.sort = this.instituteSort
    } catch (e) {
      console.warn('Error listing institutes', e)
    }
  }

  private async getAccount() {
    try {
      // get account
      this.account = await this.appwriteService.getAccount()

      // get favourite projects. Format: ['instituteId:projectId', ...]
      let projectKeys: string[] = this.account.prefs.fav_projects

      // create if not existing
      if (!projectKeys) {
        projectKeys = []
      }
      this.instituteProjectList = projectKeys.map(key => [key.split(':')[0], key.split(':')[1]] as [string, string])

      let projectIds: string[] = this.instituteProjectList.map(instituteProject => instituteProject[1])
      let projects: Project[] = []
      for await (const project of projectIds.map(projectId => this.appwriteService.getProject(projectId))) projects.push(project)

      this.projectData = new MatTableDataSource(projects)
      this.projectData.sort = this.projectSort

    } catch (e) {
      console.warn('Error getting account', e)
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
