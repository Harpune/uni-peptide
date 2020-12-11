import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
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

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    
    let email = this.loginForm.get('email')?.value;
    let password = this.loginForm.get('password')?.value;

    this.appwriteService.createSession(email, password)
      .then((account) => {
        console.log("Account", account)
        this.router.navigate(['/home'])
      })
      .catch(error => {
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
      })
  }

  register() {
    this.router.navigateByUrl('/register')
  }

  resetPassword() {
    this.snackBar.open('Wurde noch nicht implementiert', 'Ok', {
      duration: 2000
    })

  }
}
