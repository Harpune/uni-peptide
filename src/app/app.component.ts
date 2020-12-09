import { Component, OnInit, ViewChild } from '@angular/core';
import { AppwriteService } from './service/appwrite/appwrite.service';
import { User } from './models/user';
import { Router } from '@angular/router';
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
  private mobileWidth: number = 500
  @ViewChild('sidenav') sidenav!: MatSidenav;

  title = 'Peptide';

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
      name: 'Institut',
      route: '/institute',
      icon: 'folder'
    },
    {
      name: 'Teams',
      route: '/team',
      icon: 'people'
    }
  ]

  isMobile: boolean = this.showMobile(window.innerWidth)

  constructor(private appwriteService: AppwriteService,
    private storageService: StorageService,
    private router: Router) { }

  ngOnInit(): void {
    this.appwriteService.getUser()
      .then((user: User) => {
        console.log("Logged in as", user)
        this.storageService.setCurrentUser(user)
        if (!user.emailVerification) {
          // this.snackBar.open("Dein Account wurde noch nicht verifiziert", "Verifizieren").onAction().subscribe()
        }
      })
      .catch(error => console.log(error.toString()));
  }

  logout(): void {
    this.appwriteService.getCurrentSession()
      .then((session: Session) => this.appwriteService.logout(session.$id))
      .then((res) => this.storageService.removeCurrentUser())
      .finally(() => this.router.navigate(['/login']))
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.isMobile = this.showMobile(event.target.innerWidth)
    this.sidenav.toggle(!this.isMobile)

  }

  private showMobile(width: number): boolean {
    let mobile: boolean = width < this.mobileWidth
    return mobile
  }
}
