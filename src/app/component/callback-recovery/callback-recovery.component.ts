import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-callback',
  templateUrl: './callback-recovery.component.html',
  styleUrls: ['./callback-recovery.component.scss']
})
export class RecoveryCallbackComponent implements OnInit {
  passwordForm!: FormGroup

  userId!: string
  secret!: string

  constructor(private appwriteService: AppwriteService,
    private formBuilder: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('params', params)
      let userId = params.userId
      let secret = params.secret

      if (userId && secret) {
        this.userId = userId
        this.secret = secret
      } else {
        console.error('No userId or secret provided')
      }
    }, error => {
      console.log(error)
    })

    this.passwordForm = this.formBuilder.group({
      password: [null, [Validators.required]],
      passwordAgain: [null, [Validators.required]],
    });
  }

  save() {
    if (this.passwordForm.valid) {
      let password = this.passwordForm.get('password')?.value
      let passwordAgain = this.passwordForm.get('passwordAgain')?.value

      this.appwriteService.updateRecovery(this.userId, this.secret, password, passwordAgain)
        .then(res => this.router.navigate(['/login']))
        .catch(err => console.log('Could not update recovery'))
    }
  }
}
