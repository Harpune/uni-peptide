import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

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
      return;
    }
    let name = this.registerForm.get('name')?.value;
    let email = this.registerForm.get('email')?.value;
    let password = this.registerForm.get('password')?.value;
    let passwordCheck = this.registerForm.get('passwordCheck')?.value;

    console.log("name: " + name)
    if (password == passwordCheck) {
      try {
        let account = await this.appwriteService.createAccount(name, email, password)
        console.log('createAccount', account)
        let session = await this.appwriteService.createSession(email, password)
        console.log('createSession', session)
        let user = {
          name: account.name,
          email: account.email,
          account: account.$id
        }
        await this.appwriteService.createUser(user)
        console.log('createUser', user)
        this.router.navigate(['/home'])
      } catch (e) {
        console.error(e)
      }

    } else {
      this.snackBar.open('Die Passwörter stimmen nicht überein.', undefined, { duration: 2000 })
    }

  }
}
