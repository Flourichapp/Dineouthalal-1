import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class RestApprovedGuard implements CanActivate {

  constructor(
    private router: Router,
    private cookieService: CookieService

) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const restStatus = this.cookieService.get('rest_status');
      if(restStatus !== 'pending'){
        return true;
      } else {
        this.router.navigate(['rest/dashboard']);
        return false;
      }
    }
}
