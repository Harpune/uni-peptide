import { getTranslationDeclStmts } from '@angular/compiler/src/render3/view/template';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamComponent implements OnInit {

  teamForm!: FormGroup

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
  }

  getTeams() {
    this.appwriteService.listTeams()
  }
}
