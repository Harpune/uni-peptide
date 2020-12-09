import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { AppwriteService } from 'src/app/service/appwrite/appwrite.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  user!: User

  constructor(private appwriteService: AppwriteService) {

    this.appwriteService.getUser()
      .then((user: User) => this.user = user)
  }

  ngOnInit(): void {
  }
}
