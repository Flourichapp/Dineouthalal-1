import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { debounceTime, map } from 'rxjs/operators';
import { Profile } from '../_models/profile.model';
import { ServiceBase } from './service-base.service';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class ProfileService extends ServiceBase implements OnDestroy {
  profile: Profile;
  subject: Subject<any>;
  subscription: Subscription;

  constructor(protected toastrService: ToastrService, protected http: HttpClient,protected cookieService:CookieService) {
    super(toastrService, http,cookieService);
    this.subject = new ReplaySubject(1);
    this.subscription = this.subject.pipe(debounceTime(500)).subscribe(params => this.postDefaultTheme(params));
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  // getProfile(): Observable<any> {
  //   return this.getData<Profile>('/api/profile').pipe(map(profile => {
  //     this.profile = profile;
  //     return profile;
  //   }));
  // }

  setDefaultText(size: string): Observable<any> {
    const params = {
      ['txt-size']: size
    };
    return this.postData('/api/profile/default-text', null, params, false).pipe(map(profile => {
      // this.profile = profile;
      profile = profile;
      return profile;
    }));
  }

  saveProfileSettings(data: Profile): Observable<any> {
    return this.postData('/api/profile/settings', data).pipe(map(profile => {
      // this.profile = profile;
      return profile;
    }));
  }

  setDefaultTheme(type: string, theme: string): void {
    const params = {
      ['thm-typ']: type,
      ['thm']: theme
    };
    this.subject.next(params);
  }

  private postDefaultTheme(params: any): Observable<any> {
    return this.postData('/api/profile/default-theme', null, params, false).pipe(map(profile => {
      // this.profile = profile;
      profile = profile;
      return profile;
    }));
  }
}
