import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RouteAccessGuard implements CanActivate {
  package_id: string;
  acceesList: any;
  guardExecuted: boolean = false; // Add a flag to control execution
  fullAccess: string;

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private http: HttpClient
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.guardExecuted) {
      return true; // Prevent further execution
    }
    this.package_id = this.cookieService.get('package_id');
    this.fullAccess = this.cookieService.get('full_access');

    if (this.package_id !== 'null'){
      return this.http.get<any>(`${environment.apiUrl}/admin/v0/package?id=${this.package_id}`).pipe(
        switchMap((res) => {
          const AllAccessList = res?.data.access_list?.filter((item) => item.subscreen === 'false');
          this.acceesList = AllAccessList.map((item) => item.url);
  
          const requestedUrl = state.url;
          if (this.acceesList.includes(requestedUrl)) {
            this.guardExecuted = true; // Set the flag to true to prevent further execution

            return of(true);
          } else {
            this.router.navigate(['/rest/subscription']);
            this.guardExecuted = true; // Set the flag to true to prevent further execution

            return of(false);
          }
        }),
        catchError((error) => {
          console.error('Error fetching data:', error);
          // Handle the error here
          return of(false);
        })
      );
    
  
    }
    else{
      if(this.fullAccess === '0'){
        const accessList = [
          "/rest/welcome",
          "/rest/subscription",
          "/rest/profile",
  
        ];
        const requestedUrl = state.url;
        if (accessList.includes(requestedUrl)) {
          return true;
        } else {
          this.router.navigate(['/rest/subscription']);
          return false;
        }
      }
      if(this.fullAccess === '1'){
     
          return true;
      
        
      }
   
    }
   
  }
}
