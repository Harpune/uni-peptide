import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppwriteService } from 'src/app/services/appwrite/appwrite.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private appwriteService: AppwriteService) { }

  ngOnInit(): void {
    // init form
    this.registerForm = this.formBuilder.group({
      name: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      passwordCheck: [null, [Validators.required]]
    });
  }

  async register() {
    if (!this.registerForm.valid) {
      console.log('not valid', this.registerForm)
      return;
    }
    let name = this.registerForm.get('name')?.value;
    let email = this.registerForm.get('email')?.value;
    let password = this.registerForm.get('password')?.value;
    let passwordCheck = this.registerForm.get('passwordCheck')?.value;

    if (password == passwordCheck) {
      try {
        console.log('pass', password)
        let account = await this.appwriteService.createAccount(name, email, password)
        let session = await this.appwriteService.createSession(email, password)
        this.router.navigate(['/home'])
      } catch (e) {
        switch (e) {
          case 400:
            this.snackBar.open('Das Passwort ist nicht valide (> 6 Zeichen).', 'Ok', {
              duration: 2000
            })
            break;
          case 409:
            this.snackBar.open('Die E-Mail Addresse wird bereits verwendet', 'Ok', {
              duration: 2000
            })
            break;
        }
      }

    } else {
      this.snackBar.open('Die Passwörter stimmen nicht überein.', undefined, { duration: 2000 })
    }

  }
}
