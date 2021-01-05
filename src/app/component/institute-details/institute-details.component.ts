import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Institute, Project } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { CreateProjectComponent } from '../project-create/project-create.component';

@Component({
  selector: 'app-institute-details',
  templateUrl: './institute-details.component.html',
  styleUrls: ['./institute-details.component.scss']
})
export class InstituteDetailsComponent implements OnInit {

  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  displayedColumns: string[] = ['name', 'description', 'date']

  id!: string
  institute!: Institute
  dataSource!: MatTableDataSource<Project>

  // TODO: Darf nur von Team-Mitgliedern gesehen werden -> Authguard
  constructor(private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    // get project-id
    const id = this.route.snapshot.paramMap.get('instituteId')
    if (id) this.id = id

    // get data
    this.getData()
  }

  async getData() {
    try {
      let institute = await this.appwriteService.getInstitute(this.id)
      this.institute = institute

      let projects = institute.projects
      console.log('projectIds', projects)

      this.dataSource = new MatTableDataSource()

      if (projects) {
        this.dataSource.data = projects
      }

      // paginator
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
    } catch (e) {
      console.log('getData', e)
    }
  }

  showProject(project: Project) {
    this.router.navigate(['./project/' + project.$id], { relativeTo: this.route })
  }

  openDialog() {
    const dialogRef = this.dialog.open(CreateProjectComponent, {
      data: this.institute
    })

    dialogRef.afterClosed().subscribe(res => {
      console.log('Res Dialog', res)
      this.getData()
    })

  }
}
