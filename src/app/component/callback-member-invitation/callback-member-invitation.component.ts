import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Recovery } from 'src/app/models/recovery';
import { Membership } from 'src/app/models/team';
import { Account, AccountPreference } from 'src/app/models/account';
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
      // console.log('params', params)
      // get params
      let inviteId = params.inviteId
      let teamId = params.teamId
      let userId = params.userId
      let secret = params.secret
      this.updateInvitation(teamId, inviteId, userId, secret)
    }, error => {
      console.log(error)
      this.loading = false
    })
  }

  async updateInvitation(teamId: string, inviteId: string, userId: string, secret: string) {
    try {
      // update membership
      let membership: Membership = await this.appwriteService.updateMembershipStatus(teamId, inviteId, userId, secret)

      // save inviteId to delete membership later
      let pref: AccountPreference = await this.appwriteService.updateAccountPrefs({ inviteId: inviteId })
      this.account = await this.appwriteService.getAccount()
      console.log('Account', this.account)

      // start recovery to set password
      let recovery: Recovery = await this.appwriteService.createRecovery(membership.email)

      // display information with time of experation
      let expireDate = new Date(recovery.expire * 1000)
      let dateString: string = expireDate.getHours() + ':' + expireDate.getSeconds()
      this.snackbar.open('Es wurde eine E-Mail an ' + membership.email + ' gesendet. Klicken Sie auf den Link in der E-Mail um ein Passwort zu erstellen. Link läuft um ' + dateString + ' ab', 'Ok');

    } catch (e) {
      console.log('Could not update membership status', e)
    } finally {
      this.loading = false
    }
  }

}
