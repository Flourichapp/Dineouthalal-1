import { Injectable, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { ServiceBase } from './service-base.service';
import { ReplaySubject, Subject, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, map } from 'rxjs/operators';
import { Profile } from '../_models/profile.model';
import { common as Const } from '../_const/common';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })

export class AuthService extends ServiceBase implements OnDestroy {
  subject: Subject<any>;
  subscription: Subscription;
  profile: Profile;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(protected toastrService: ToastrService, protected http: HttpClient,public cookieService: CookieService) {
    super(toastrService, http , cookieService);
    this.subject = new ReplaySubject(1);
    this.subscription = this.subject.pipe(debounceTime(500)).subscribe(params => this.postDefaultTheme(params));
    const cu = this.cookieService.get(Const.USER);
    // if (!cu) {
    //   this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.cookieService.get('currentUser')));
    //   this.currentUser = this.currentUserSubject.asObservable();
    // }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  public get currentUserValue(): User {
    return this.currentUserSubject.value;
  }

  public getToken(): string {
    return this.cookieService.get(Const.TOKEN);
  }

  isLoggedIn() {
    const token = this.cookieService.get(Const.TOKEN);
    if (!token) {
      return false;
    }
    return true;
  }

  isAdmin() {
    const isAdmin = this.cookieService.get(Const.ROLE);
    if (isAdmin === Const.ROLE_TYPE.ADMIN) {
      return true;
    } else {
      return false;
    }
  }

  isRestOwner() {
    const role = this.cookieService.get(Const.ROLE);
    if (role === Const.ROLE_TYPE.RESTAURANT) {
      return true;
    } else {
      return false;
    }
  }

  isCustomer() {
    const role = this.cookieService.get(Const.ROLE);
    if (role === Const.ROLE_TYPE.CUSTOMER) {
      return true;
    } else {
      return false;
    }
  }

  userRole() {
    const userrole = this.cookieService.get(Const.ROLE);
    return userrole;
  }

  getUserId() {
    try {
      const user = JSON.parse(this.cookieService.get(Const.USER));
      if (user) {
        return user.id;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  getUser() {
    try {
      const user = JSON.parse(this.cookieService.get(Const.USER));
      if (user) {
        return user;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }

  async logout() {
    await   this.cookieService.delete('USER_ROLE');
    await    this.cookieService.delete('TOKEN');
    await   this.cookieService.delete('CURRENT_USER');
    await   this.cookieService.delete('default_rest_id');
    await  this.cookieService.delete('rest_status');
    await   this.cookieService.delete('rest_name');
    await  this.cookieService.delete('package_id');
    await   this.cookieService.delete('full_access')
    await  this.cookieService.delete(Const.USER);
    await  this.cookieService.delete(Const.TOKEN);
    await    this.cookieService.delete(Const.IS_ADMIN);
    await   this.cookieService.delete(Const.ROLE);
  }

  private postDefaultTheme(params: any): Observable<any> {
    return this.postData('/api/profile/default-theme', null, params, false).pipe(map(profile => {
      // this.profile = profile;
      profile = profile;
      return profile;
    }));
  }

  // adminlogin = (params: any) => this.postData(`${environment.apiUrl}/admin/auth/login`, params, null, false)
  public adminlogin(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/admin/auth/login`, params, null, true).pipe(map(admin => {
      // this.currentUserSubject.next(admin.user);
      return admin;
    }))
  }
  

  public restaurantRegister(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/auth/register`, params, null, true).pipe(map(admin => {
      // this.currentUserSubject.next(admin.user);
      return admin;
    }))
  }

  public restaurantLogin(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/auth/login`, params, null, true).pipe(map(admin => {
      // this.currentUserSubject.next(admin.user);
      return admin;
    }))
  }

  public forgotPasswordVendor(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/auth/forgotpassword`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public customerRegister(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v2/auth/register`, params, null, true).pipe(map(admin => {
      // this.currentUserSubject.next(admin.user);
      return admin;
    }))
  }

  public customerLogin(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v2/auth/login`, params, null, true).pipe(map(admin => {
      // this.currentUserSubject.next(admin.user);
      return admin;
    }))
  }

  public forgotPasswordCustomer(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v2/auth/forgotpassword`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }
}