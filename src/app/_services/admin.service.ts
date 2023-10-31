import { Injectable, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { ServiceBase } from './service-base.service';
import { ReplaySubject, Subject, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Profile } from '../_models/profile.model';
import { common as Const } from '../_const/common';
import { catchError, map } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })

export class AdminService extends ServiceBase implements OnDestroy{
    subject: Subject<any>;
    subscription: Subscription;
    profile: Profile;
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(protected toastrService: ToastrService, protected http: HttpClient,protected cookieService:CookieService) {
        super(toastrService, http,cookieService);
      }
    ngOnDestroy() {
      // this.subscription.unsubscribe();
    }

    public getDashboardData(): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/getDashboardData`, {}, null, true).pipe(map(data => {
        return data;
      }))
    }

    public getAllRestsByAdmin(params:any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/restaurants`, params, null, true).pipe(map(data => {
        return data;
      }))
    }

    public getRestDetail(params:any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/getrestdetail`, params, null, true).pipe(map(data => {
        return data;
      }))
    }
    
    
    public updateRestStatus(params:any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/restaurant`, params, null, true).pipe(map(data => {
        return data;
      }))
    }
    
     public uploadBlog(params: any): Observable<any> {
       return this.postData(`${environment.apiUrl}/admin/v0/uploadblog`, params, null, true).pipe(map(data => {
         return data;
       }))
     }
    // public uploadBlog(formData): Observable<any> {

    //   return this.http.post(`${environment.apiUrl}/admin/v0/blog`, formData, {
    //     reportProgress: true,
    //     observe: 'events'
    //   })).pipe(
    //     catchError(this.handleError)
    //   )
    // }
    // public updateBlog(formData ,id): Observable<any> {

    //   return this.http.put(`${environment.apiUrl}/admin/v0/updateBlogById/${id}`, formData, {
    //     reportProgress: true,
    //     observe: 'events'
    //   })).pipe(
    //     catchError(this.handleError)
    //   )
    // }
     public deleteBlog(id): Observable<any> {

       return this.http.delete(`${environment.apiUrl}/admin/v0/blog/${id}`, {
         reportProgress: true,
         observe: 'events'
       }).pipe(
         catchError(this.handleError)
       )
     }
    
     public getBlogsByUserId(params: any): Observable<any> {
       return this.getData(`${environment.apiUrl}/v3/getblogs`, params, null).pipe(map(data => {
         return data;
       }))
     }
  

    public getAllTransactions(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/getalltransactions`, params, null, true).pipe(map(data => {
        return data;
      }))
    }

    public getSettingData(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/getsettingdata`, params, null, true).pipe(map(data => {
        return data;
      }))
    }

    public updateSettingData(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/updatesettingdata`, params, null, true).pipe(map(data => {
        return data;
      }))
    }

    public getSubscribers(): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/getSubscribers`, null, null, true).pipe(map(data => {
        return data;
      }))
    }

    // cuisine category
    public getCuisineCategorySetting(): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/getcuisinecategory`, null, null, true).pipe(map(data => {
          return data;
      }))
    }

    public addCuisineCategorySetting(params:any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/addcuisinecategory`, params, null, true).pipe(map(data => {
        return data;
      }))
    }

    public updateCuisineCategorySetting(params:any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/updatecuisinecategory`, params, null, true).pipe(map(data => {
        return data;
      }))
    }

    public deleteCuisineCategorySetting(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/deletecuisinecategory`, params, null, true).pipe(map(data => {
          return data;
      }))
    }
    public restoreCuisineCategorySetting(params: any): Observable<any> {
      return this.postData(`${environment.apiUrl}/admin/v0/restorecuisinecategory`, params, null, true).pipe(map(data => {
          return data;
      }))
    }
  }