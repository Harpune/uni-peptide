import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-callback-verification',
  templateUrl: './callback-verification.component.html',
  styleUrls: ['./callback-verification.component.scss']
})
export class VerificationCallbackComponent implements OnInit {

  account!: any
  loading: boolean = false
  verified: boolean = false

  constructor(private appwriteService: AppwriteService,
    private router: Router,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.loading = true
    this.getAccount()
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('params', params)
      let userId = params.userId
      let secret = params.secret
      if (userId && secret) {
        this.appwriteService.updateVerification(userId, secret)
          .then(res => this.verified = true)
          .catch(err => this.verified = false)
          .finally(() => this.loading = false)
      } else {
        this.loading = false
        this.verified = false
      }
    }, error => {
      console.log(error)
    })
  }

  async getAccount() {
    try {
      this.account = await this.appwriteService.getAccount()
    } catch (e) {
      this.account = null
    }
  }

}
