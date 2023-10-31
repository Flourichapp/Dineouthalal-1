import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,NavigationEnd ,NavigationStart} from '@angular/router';
import { AuthService } from '../_services';
import { filter, pairwise } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class CustomerGuard implements CanActivate {

    constructor(
        private router: Router,
        private authService: AuthService
    ) { 
      
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const isLoggedIn =  this.authService.isLoggedIn();
        const isCustomer = this.authService.isCustomer();

        if (isLoggedIn) {
            if(isCustomer) {
                return true;
            }
        }
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}
