import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Team } from 'src/app/models/team';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamComponent implements OnInit {

  teamForm!: FormGroup
  dataSource!: MatTableDataSource<Team>;
  displayedColumns: string[] = ['$id', 'name', 'dateCreated', 'delete']

  constructor(private formBuilder: FormBuilder,
    private appwriteService: AppwriteService) {
    this.getTeams()
  }

  ngOnInit(): void {
    // init form
    this.teamForm = this.formBuilder.group({
      name: [null, Validators.required]
    });
  }

  submit() {
    if (!this.teamForm.valid) {
      return;
    }

    // form data
    let name: string = this.teamForm.get('name')?.value as string
    console.log(name);
    this.appwriteService.createTeam(name)
      .finally(() => this.getTeams())
  }

  delete(team: Team) {
    console.log('team to delte', team)
    this.appwriteService.deleteTeam(team.$id)
      .finally(() => this.getTeams())
  }

  getTeams() {
    this.appwriteService.listTeams()
      .then(teams => {
        console.log('teams', teams)
        this.dataSource = new MatTableDataSource(teams)
      })
  }
}
