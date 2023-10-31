import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { AuthService } from '../_services';

@Injectable({ providedIn: 'root' })
export class AdminAuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authService: AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const isLoggin = this.authService.isLoggedIn();
        const isAdmin = this.authService.isAdmin();
        if ( isLoggin && isAdmin) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/admin/login']);
        // this.router.navigate(['auth/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}