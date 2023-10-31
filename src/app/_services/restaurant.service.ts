import { Injectable, OnDestroy } from '@angular/core';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { ServiceBase } from './service-base.service';
import { ReplaySubject, Subject, Subscription, BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, catchError } from 'rxjs/operators';
import { Profile } from '../_models/profile.model';
import { common as Const } from '../_const/common';
import { AuthService } from './auth.service';
import { CookieService } from 'ngx-cookie-service';
import { map } from 'rxjs/operators';


@Injectable({ providedIn: 'root' })

export class RestaurantService extends ServiceBase implements OnDestroy {
  subject: Subject<any>;
  subscription: Subscription;
  profile: Profile;
  private currentUserSubject: BehaviorSubject<User>;
  public currentUser: Observable<User>;

  constructor(protected toastrService: ToastrService, protected http: HttpClient, private authService: AuthService,protected cookieService:CookieService) {
    super(toastrService, http,cookieService);
  }
  ngOnDestroy() {
    // this.subscription.unsubscribe();
  }

  public updateProfile(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/update_admin_profile`, params, null, true).pipe(map(data => {
      return data;
    }))
  }

  public getDashboardData(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/getdashboarddata`, params, null, true).pipe(map(data => {
      return data;
    }))
  }

  public getTotalReviews(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/gettotalreviews`, params, null, true).pipe(map(data => {
      return data;
    }))
  }

  // private postDefaultTheme(params: any): Observable<Profile> {
  //   return this.postData('/api/profile/default-theme', null, params, false).pipe(map(profile => {
  //     this.profile = profile;
  //     return profile;
  //   }))
  // }

  public getSetting(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/getsetting`, params, null, true).pipe(map(data => {
      return data;
    }))
  }


  public updateSetting(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/updatesetting`, params, null, true).pipe(map(admin => {
      // this.currentUserSubject.next(admin.user);
      return admin;
    }))
  }

  public uploadThumbnail(restaurantId: number, image: string): Observable<any> {
    const formData: any = new FormData();
    formData.append('restaurant_id', restaurantId);

    return this.postData(
      `${environment.apiUrl}/v1/profile/uploadthumbnail`,
      { restaurant_id: restaurantId, media: image }, null, true)
      .pipe(map(res => {
        return res;
      }))
  }

  public deleteThumbnail(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/deletethumbnail`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public uploadGallayImg(restaurantId: number, image: string, kind: string): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/uploadgallaryimg`,
      { restaurant_id: restaurantId, media: image, kind: kind }, null, true)
      .pipe(map(res => {
        return res;
      }))
  }

  public uploadGalleries(restaurant_id: number, menu: FileList): Observable<any> {
    const formData: any = new FormData();
    formData.append('restaurant_id', restaurant_id);
    Array.from(menu).forEach(file => {
      formData.append('media', file);
    });

    return this.http.post(`${environment.apiUrl}/v1/profile/uploadgalleries`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    )
  }


  public deleteGallayImg(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/deletegallaryimg`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public updateOfferMenu(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/updateoffermenu`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public getSettingInformationMetaData() {
    return this.postData(`${environment.apiUrl}/v1/profile/getsettinginformationmetadata`, null, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public updateSettingInformation(params: any) {
    return this.postData(`${environment.apiUrl}/v1/profile/updatesettinginformation`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public updateSettingAddress(params: any) {
    return this.postData(`${environment.apiUrl}/v1/profile/updatesettingaddress`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public uploadSettingMenu(restaurant_id: number, menu: FileList): Observable<any> {
    const formData: any = new FormData();
    formData.append('restaurant_id', restaurant_id);
    Array.from(menu).forEach(file => {
      formData.append('media', file);
    });

    return this.http.post(`${environment.apiUrl}/v1/profile/uploadsettingmenu`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    )
  }

  public deleteSettingFullMenu(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/deletefullmenu`, params, null, true).pipe(map(admin => {
      return admin;
    }))
  }

  public getRestSeats(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/getrestseats`, params, null, true).pipe(map(res => {
      return res;
    }))
  }

  public updateRestSeat(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/updaterestseat`, params, null, true).pipe(map(res => {
      return res;
    }))
  }

  public updateDateTimeInfo(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/updatedatetimeinfo`, params, null, true).pipe(map(res => {
      return res;
    }))
  }


  public getBookingInfo(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/booking/getinfo`, params, null, true).pipe(map(res => {
      return res;
    }))
  }

  public updateBookingStatus(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/booking/updatebookingstatus`, params, null, true).pipe(map(res => {
      return res;
    }))
  }


  public getRestInfoByUserId(): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/getrestinfobyuserid`, { user_id: this.authService.getUserId() }, null, true).pipe(map(res => {
      return res;
    }))
  }

  public addNewRestaurant(): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/addnewrestaurant`, { user_id: this.authService.getUserId() }, null, true).pipe(map(res => {
      return res;
    }))
  }

  public stripePayment(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/payment/stripe`, params, null, true).pipe(map(res => {
      return res;
    }))
  }

  public getTransactionsByRestId(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/payment/gettransactionsbyrestid`, params, null, true).pipe(map(res => {
      return res;
    }))
  }




  public getRestaurantMenu(params: any= null): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/getmenu`, params, null, true).pipe(map(data => {
        return data;
    }))
  }

  public addRestaurantMenu(formData): Observable<any> {

    return this.http.post(`${environment.apiUrl}/v1/profile/addmenu`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    )
  }
  public addRestaurantMenuPdf(formData): Observable<any> {

    return this.http.put(`${environment.apiUrl}/v1/profile/menu`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    )
  }


  public updateRestaurantMenu(formData): Observable<any> {

    return this.http.post(`${environment.apiUrl}/v1/profile/updatemenu`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    )
  }
  public contactUs(formData): Observable<any> {

    return this.http.post(`${environment.apiUrl}/v3/contact`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.handleError)
    )
  }

  public deleteRestaurantMenu(params: any): Observable<any> {
    return this.postData(`${environment.apiUrl}/v1/profile/deletemenu`, params, null, true).pipe(map(data => {
        return data;
    }))
  }

}
