import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Account } from 'src/app/models/account';
import { User } from 'src/app/models/user';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  userForm!: FormGroup
  editable: boolean = false

  account!: Account
  user!: User
  breakpoint!: number

  constructor(private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private appwriteService: AppwriteService) {

    this.appwriteService.getAccount()
      .then((account: Account) => {
        this.account = account

        this.resetForm()
        this.userForm.disable()
      })
  }

  private resetForm() {
    let registration: Date = new Date(this.account.registration * 1000);

    this.userForm = this.formBuilder.group({
      name: [this.account.name, [Validators.required]],
      email: [this.account.email, [Validators.required]],
      registration: [registration, [Validators.required]],
      roles: [this.account.roles, [Validators.required]],
    });
  }

  toggleEdit(): void {
    this.editable = !this.editable
    if (this.editable) {
      this.userForm.enable()
    } else {
      this.userForm.disable()
      this.resetForm()
    }
  }

  save() {
    this.snackbar.open('Noch nicht implementiert', 'Ok', { duration: 2000 })
  }

  verify(){
    this.appwriteService.verifyAccount()
  }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= environment.mobileSize) ? 1 : 2;

  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= environment.mobileSize) ? 1 : 2;
  }
}
