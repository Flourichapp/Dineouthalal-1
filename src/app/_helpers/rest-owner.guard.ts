import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services';

@Injectable({
  providedIn: 'root'
})
export class RestOwnerGuard implements CanActivate {

  constructor(
    public router: Router,
    private authService: AuthService
) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    // return true;
    const currentUser = this.authService.isLoggedIn();
    const isRestOwner = this.authService.isRestOwner();
    if (currentUser && isRestOwner) {
        return true;
    }

    if (this.authService.isAdmin()) {
      this.router.navigate(['/rest/welcome']);
      return false;
    }
    this.router.navigate(['/login']);
    return false;

    }
}