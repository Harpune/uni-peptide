import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Account } from 'src/app/models/account';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

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
  }

  async login() {
    if (!this.loginForm.valid) {
      return;
    }

    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;

    try {
      await this.appwriteService.createSession(email, password)
      this.router.navigate(['/home'])
      let account: Account = await this.appwriteService.getAccount()
      if (!account.emailVerification) {
        this.snackBar.open('Ihr Account ist noch nicht verifiziert', 'Verfizieren', { duration: 5000 }).onAction().subscribe(
          res => this.appwriteService.createVerification()
            .then(res => this.snackBar.open('Es wurde eine E-Mail an ' + account.email + ' gesendet', 'Ok', { duration: 2000 })))
      } else {
        console.log('Account is verified')
      }
    } catch (error) {
      switch (error) {
        case 'Bad Request':
          this.snackBar.open('Das Passwort ist zu kurz.', 'Ok', {
            duration: 2000
          })
          break;
        case 'Unauthorized':
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
      this.appwriteService.createRecovery(email)
        .then(res => {
          this.snackBar.open('Es wurde eine E-Mail an ' + email + ' gesendet.', 'Ok', { duration: 2000 })
        })
        .catch(err => {
          this.snackBar.open('Es konnte keine E-Mail gesendet werden', 'Eintragen', { duration: 2000 })
        })
    }
  }
}
