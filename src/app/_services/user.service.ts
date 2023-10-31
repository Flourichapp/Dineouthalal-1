import { Injectable, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { ServiceBase } from './service-base.service';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs/operators';
import { Profile } from '../_models/profile.model';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';

@Injectable()

export class UserService extends ServiceBase implements OnDestroy{
    subject: Subject<any>;
    subscription: Subscription;
    profile: Profile;

    constructor(protected toastrService: ToastrService, protected http: HttpClient ,protected cookieService :CookieService) {
        super(toastrService, http,cookieService);
        this.subject = new ReplaySubject(1);
        // this.subscription = this.subject.pipe(debounceTime(500)).subscribe(params => this.postDefaultTheme(params));
      }
    ngOnDestroy() {
        // this.subscription.unsubscribe();
      }
    getAll() {
        return this.http.get<User[]>(`${environment.apiUrl}/users`);
    }

    // private postDefaultTheme(params: any): Observable<any> {
    //     return this.postData('/api/profile/default-theme', null, params, false).pipe(map(profile => {
    //       this.profile = profile;
    //       return profile;
    //     }));
    // }

    public getPendingUser(params: any): Observable<any> {
        return this.postData(`${environment.apiUrl}/admin/creators/pending`, null, params, false).pipe(map(pendinguser => {
            return pendinguser;
        }))
    }

    public getUserDetail(data: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/creators/getdetail`, data, null, true).pipe(map(user => {
          return user;
      }))
    }

    public approveUser(data: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/creators/approve`, data, null, true).pipe(map(user => {
          return user;
      }))
    }
    
    public getRestaurants(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v1/creators/all`, params, null, true).pipe(map(pendinguser => {
          return pendinguser;
      }))
    }

        
    public getCustomers(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v1/customer/all`, params, null,  true).pipe(map(pendinguser => {
          return pendinguser;
      }))
    }
}