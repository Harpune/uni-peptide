import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Institute } from 'src/app/models/institute';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-institute',
  templateUrl: './institute.component.html',
  styleUrls: ['./institute.component.scss']
})
export class InstituteComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['teamId', 'name', 'organisation', 'address', 'delete']
  start: number = 0
  end: number = 10
  isLoading: boolean = true
  limitReached: boolean = false
  resultLength: number = 0

  instituteForm!: FormGroup
  //dataSource!: Institute[];
  dataSource!: MatTableDataSource<Institute>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private formBuilder: FormBuilder,
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

  ngAfterViewInit(): void {
    this.paginator.page.subscribe(
      (asd: any) => {
        console.log(asd)
      }, (err: any) => {
        console.log(err)
      })
  }

  submit() {
    if (!this.instituteForm.valid) {
      return;
    }

    // form data
    let data: object = this.instituteForm.value as Institute
    console.log(data);
    this.appwriteService.createInstitute(data)
      .then((instute: Institute) => this.getInstitutes())
      .finally(() => this.instituteForm.reset())
  }

  delete(institute: Institute) {
    this.appwriteService.deleteInstitute(institute)
      .finally(() => this.getInstitutes())
  }

  private getInstitutes() {
    this.appwriteService.listTeams()
    this.appwriteService.listInstitutes()
      .then((institutes: Institute[]) => {
        this.dataSource = new MatTableDataSource(institutes)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      })
  }
}
