import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Institute } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { CreateInstituteComponent } from '../institute-create/institute-create.component';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator
  @ViewChild(MatSort) sort!: MatSort

  displayedColumns: string[] = ['teamId', 'name', 'organisation', 'address', 'delete']
  start: number = 0
  end: number = 10
  isLoading: boolean = true
  limitReached: boolean = false
  resultLength: number = 0

  instituteForm!: FormGroup
  //dataSource!: Institute[];
  dataSource!: MatTableDataSource<Institute>;

  constructor(private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private appwriteService: AppwriteService) {
    this.getInstitutes()
  }

  ngOnInit(): void {
    // init form
    this.instituteForm = this.formBuilder.group({
      name: [null, Validators.required],
      organisation: [null],
      address: [null],
    });
  }

  delete(institute: Institute) {
    this.appwriteService.deleteInstitute(institute)
      .finally(() => this.getInstitutes())
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateInstituteComponent, {
      data: {
        name: null,
        organisation: null,
        address: null
      }
    })

    dialogRef.afterClosed().subscribe(res => {
      this.appwriteService.createInstitute(res as Institute)
        .then((_) => this.getInstitutes())
    })
  }

  private getInstitutes() {
    this.appwriteService.listInstitutes()
      .then((institutes: Institute[]) => {
        this.dataSource = new MatTableDataSource(institutes)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
}


