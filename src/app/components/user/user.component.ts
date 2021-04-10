import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Account } from 'src/app/models/account';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  account!: Account

  // forms
  accountForm!: FormGroup
  accountEditable: boolean = false
  authForm!: FormGroup
  authEditable: boolean = false


  verifying: boolean = false
  breakpoint!: number

  constructor(private formBuilder: FormBuilder,
    private snackbar: MatSnackBar,
    private router: Router,
    private appwriteService: AppwriteService) {

    this.appwriteService.getAccount()
      .then((account: Account) => {
        this.account = account

        // Account
        this.resetAccountForm()
        this.accountForm.disable()

        // Authentication
        this.resetAuthForm()
        this.authForm.disable()
      })
  }

  ngOnInit(): void {
    this.breakpoint = (window.innerWidth <= environment.mobileSize) ? 1 : 2
  }

  verify() {
    this.verifying = true
    this.appwriteService.createVerification()
      .then(res => this.snackbar.open('Es wurde eine E-Mail an ' + this.account.email + ' versandt', 'Ok', { duration: 2000 }))
      .catch(err => this.snackbar.open('Es konnte keine E-Mail gesendet werden.', 'Ok', { duration: 2000 }))
      .finally(() => this.verifying = false)
  }

  async deleteAccount() {
    if (confirm('Wollen wirklich ihren Account löschen?')) {
      try {
        await this.appwriteService.deleteAccount()
        this.router.navigate(['/login'])
      } catch (e) {
        this.router.navigate(['/login'])
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.breakpoint = (event.target.innerWidth <= environment.mobileSize) ? 1 : 2;
  }

  saveAccount() {
    if (this.accountForm.invalid) {
      this.snackbar.open('Nicht valide', 'Ok', { duration: 2000 })
      return;
    }

    if (confirm('Wollen sie Ihre neuen Nutzerdaten speichern?')) {
      this.account.name = this.accountForm.get('name')?.value
      this.account.prefs.street = this.accountForm.get('street')?.value
      this.account.prefs.streetNumber = this.accountForm.get('streetNumber')?.value
      this.account.prefs.zip = this.accountForm.get('zip')?.value
      this.account.prefs.city = this.accountForm.get('city')?.value

      this.appwriteService.updateAccountName(this.account.name)
      this.appwriteService.updateAccountPrefs(this.account.prefs)

      this.toggleAccountEdit()
    }
  }

  toggleAccountEdit(): void {
    this.accountEditable = !this.accountEditable
    if (this.accountEditable) {
      this.accountForm.enable()
    } else {
      this.accountForm.disable()
      this.resetAccountForm()
    }
  }

  private resetAccountForm() {
    this.accountForm = this.formBuilder.group({
      name: [this.account.name, [Validators.required]],
      street: [this.account.prefs.street],
      streetNumber: [this.account.prefs.streetNumber],
      zip: [this.account.prefs.zip],
      city: [this.account.prefs.city],
    });
  }

  saveAuth() {
    if (this.authForm.invalid) {
      this.snackbar.open('Nicht valide', 'Ok', { duration: 2000 })
      return;
    }

    if (confirm('Wollen sie Ihre neuen Anmeldeinformationen speichern?')) {
      this.account.email = this.authForm.get('email')?.value
      let oldPassword = this.authForm.get('oldPassword')?.value
      let password = this.authForm.get('password')?.value

      this.appwriteService.updateAccountEmail(this.account.email, oldPassword)
      if (password) this.appwriteService.updateAccountPassword(password, oldPassword)


      this.toggleAuthEdit()
    }
  }

  toggleAuthEdit(): void {
    this.authEditable = !this.authEditable
    if (this.authEditable) {
      this.authForm.enable()
    } else {
      this.authForm.disable()
      this.resetAuthForm()
    }
  }

  private resetAuthForm() {
    this.authForm = this.formBuilder.group({
      email: [this.account.email, [Validators.required, Validators.email]],
      oldPassword: [null, [Validators.required]],
      password: [null]
    });
  }
}
