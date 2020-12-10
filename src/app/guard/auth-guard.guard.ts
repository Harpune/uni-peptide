import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AppwriteService } from '../service/appwrite/appwrite.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private appwriteService: AppwriteService, private router: Router) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.appwriteService.isLoggedIn()
      .then(loggedIn => {
        if (!loggedIn) {
          console.log("Logged out! Directed to /login")
          return this.router.createUrlTree(['/login'])

        } else {
          console.log("Logged in")
          return true
        }
      })
  }
}
