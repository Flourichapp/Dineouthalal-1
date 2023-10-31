import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const currentUser = this.authService.getUserId();

        const isAdmin  = this.authService.isAdmin();
        const isRestOwner = this.authService.isRestOwner();
        const isLoggedIn =  this.authService.isLoggedIn();
        const isCustomer = this.authService.isCustomer();

        if (isLoggedIn) {
            if(isAdmin) {
                this.router.navigate(['admin/dashboard']);
                return false;
            } else if(isRestOwner) {
                this.router.navigate(['rest/dashboard']);
                return false;
            } else if(isCustomer) {
                this.router.navigate(['/']);
                return false;
            }
        }

        // not logged in so redirect to login page with the return url
        // this.router.navigate(['auth/login']);
        // this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
        return true;
    }
}