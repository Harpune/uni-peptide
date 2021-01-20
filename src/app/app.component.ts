import { Component, OnInit, ViewChild } from '@angular/core';
import { AppwriteService } from './services/appwrite/appwrite.service';
import { environment } from 'src/environments/environment'
import { Account } from './models/account';
import { Event, NavigationEnd, Router } from '@angular/router';
import { Session } from './models/session';
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
    }
  ]

  account!: Account | null

  constructor(private appwriteService: AppwriteService,
    private router: Router) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        console.log('Navigated to', event.urlAfterRedirects)
        this.getAccount()
      }
    })
  }

  ngOnInit(): void {
    this.isMobile = window.innerWidth <= environment.mobileSize
  }

  async getAccount() {
    this.appwriteService.getAccount()
      .then((account: Account) => this.account = account)
      .catch(error => this.account = null)
  }

  logout(): void {
    this.appwriteService.getCurrentSession()
      .then((session: Session) => this.appwriteService.deleteSession(session.$id))
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
