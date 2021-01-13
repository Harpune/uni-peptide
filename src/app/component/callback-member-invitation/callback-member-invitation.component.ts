import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Recovery } from 'src/app/models/recovery';
import { Membership } from 'src/app/models/team';
import { Account } from 'src/app/models/account';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-callback-member-invitation',
  templateUrl: './callback-member-invitation.component.html',
  styleUrls: ['./callback-member-invitation.component.scss']
})
export class MemberInvitationCallbackComponent implements OnInit {
  loading: boolean = false
  account!: Account

  constructor(private appwriteService: AppwriteService,
    private router: Router,
    private snackbar: MatSnackBar,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.loading = true
    this.activatedRoute.queryParams.subscribe(params => {
      console.log('params', params)
      let inviteId = params.inviteId
      let teamId = params.teamId
      let userId = params.userId
      let secret = params.secret
      if (inviteId && teamId && userId && secret) {
        this.updateInvitation(teamId, inviteId, userId, secret)
      } else {
        this.loading = false
      }
    }, error => {
      console.log(error)
      this.loading = false
    })
  }

  async updateInvitation(teamId: string, inviteId: string, userId: string, secret: string) {
    try {
      let membership: Membership = await this.appwriteService.updateMembershipStatus(teamId, inviteId, userId, secret)
      this.account = await this.appwriteService.getAccount()
      console.log('Account', this.account)
      let recovery: Recovery = await this.appwriteService.createRecovery(membership.email)

      let expireDate = new Date(recovery.expire * 1000)
      let dateString: string = expireDate.getHours + ':' + expireDate.getSeconds()
      console.log('')
      this.snackbar.open('Es wurde eine E-Mail an ' + membership.email + ' gesendet. Klicken Sie auf den Link in der E-Mail um ein Passwort zu erstellen. Link läuft um ' + dateString.toTimeString() + ' ab', 'Ok');

    } catch (e) {
      console.log('Could not update membership status', e)
    } finally {
      this.loading = false
    }
  }

}
