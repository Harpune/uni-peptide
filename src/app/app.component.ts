import { Component, OnInit, ViewChild } from '@angular/core';
import { AppwriteService } from './service/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Account } from './models/account';
import { Event, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Session } from './models/session';
import { StorageService } from './service/storage/storage.service';
import { HostListener } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = 'Peptide'
  isMobile!: boolean

  navItems = [
    {
      name: 'Home',
      route: '/home',
      icon: 'house'
    },
    {
      name: 'User',
      route: '/user',
      icon: 'face'
    },
    {
      name: 'Institute',
      route: '/institute',
      icon: 'folder'
    },
    {
      name: 'Teams',
      route: '/team',
      icon: 'bug_report'
    }
  ]

  account!: Account | null

  constructor(private appwriteService: AppwriteService,
    private storageService: StorageService,
    private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.getAccount()
      }
    })
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= environment.mobileSize
  }

  async getAccount() {
    // let isLoggedIn = await this.appwriteService.isLoggedIn()
    this.appwriteService.getAccount()
      .then((user: Account) => {
        console.log("Logged in as", user)
        this.account = user
        this.storageService.setCurrentUser(user)
        if (!user.emailVerification) {
          // this.snackBar.open("Dein Account wurde noch nicht verifiziert", "Verifizieren").onAction().subscribe()
        }
      })
      .catch(error => {
        this.account = null
        console.log(error)
      });
  }

  logout(): void {
    this.appwriteService.getCurrentSession()
      .then((session: Session) => this.appwriteService.deleteSession(session.$id))
      .then((res) => this.storageService.removeCurrentUser())
      .finally(() => this.router.navigate(['/login']))
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = event.target.innerWidth < environment.mobileSize
    if (this.account != null) {
      this.sidenav.toggle(!this.isMobile)
    }
  }
}
