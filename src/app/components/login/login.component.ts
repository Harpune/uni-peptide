import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { AppwriteError } from 'src/app/models/error';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  account!: Account
  loginForm!: FormGroup
  sendingEmail: boolean = false

  constructor(private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private appwriteService: AppwriteService,
    private router: Router) { }

  ngOnInit(): void {
    // init form
    this.loginForm = this.formBuilder.group({
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]]
    });
    this.getAccount();
  }

  async getAccount() {
    try {
      this.account = await this.appwriteService.getAccount();
    } catch (e) {
      console.log('Not logged in', e)
    }
  }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }

    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;

    try {
      // login
      await this.appwriteService.createSession(email, password)
      this.router.navigate(['/home'])
    } catch (error) {
      switch (error) {
        case 400:
          this.snackBar.open('Das Passwort ist nicht valide (> 6 Zeichen).', 'Ok', {
            duration: 2000
          })
          break;
        case 401:
          this.snackBar.open('Die E-Mail Addresse und das Passwort stimmen nicht überein', 'Ok', {
            duration: 2000
          })
          break;
      }
    }
  }

  register() {
    this.router.navigateByUrl('/register')
  }

  resetPassword() {
    let email = this.loginForm.get('email')?.value;
    if (!email) {
      this.snackBar.open('Bitte geben Sie Ihre E-Mailaddresse ein', 'Ok', {
        duration: 2000
      })
    } else {
      this.sendingEmail = true
      this.appwriteService.createRecovery(email)
        .then(res => {
          this.snackBar.open('Es wurde eine E-Mail an ' + email + ' gesendet.', 'Ok', { duration: 2000 })
        })
        .catch(err => {
          this.snackBar.open('Es konnte keine E-Mail gesendet werden', 'Eintragen', { duration: 2000 })
        })
        .finally(() => this.sendingEmail = false)
    }
  }
}
