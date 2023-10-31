import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor,HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { CookieService } from 'ngx-cookie-service';

// const token = localStorage.getItem('token');

@Injectable()
export class ServiceBase {
   

  
  // public headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` });
  // public headers = new HttpHeaders({ 'Content-Type': 'application/ld+json', 'Authorization': `Bearer ${token}` });

  constructor(protected toastrService: ToastrService, protected http: HttpClient,protected cookieService: CookieService) {}

  protected handleError(error: Response | any): Promise<any> {
    let errMsg: string;
    if (error instanceof Response) {
    
      const body = error.json() || '';
      var err = body['error'] || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.error.message ? error.error.message : error.toString();
    }
    this.toastrService.error(errMsg, 'Error');
    return Promise.reject(errMsg);
  }

  createKey(url: string, params?: any): string {
    return url + (params ? JSON.stringify(params) : '');
  }

  // protected getData<T>(url: string, params?: any, handleError: boolean = true): Promise<T> {
  //   return this.http
  //     .get<T>(url, {
  //       params: params
  //     })
  //     .toPromise()
  //     .catch(error => {
  //       if (handleError) {
  //         return this.handleError(error);
  //       } else {
  //         return Promise.reject(error);
  //       }
  //     });
  // }
  getData(url: string, data?: any, params?: any, handleError: boolean = true, ): Observable<object> {
    return this.http
      .get(url, {
        params: params
      })
    }
  protected getCachedData<T>(url: string, params?: any, handleError: boolean = true): Promise<T> {
    const key: string = this.createKey(url, params);
    
    const data: string = sessionStorage.getItem(key);
    if (data) {
      return Promise.resolve(JSON.parse(data) as T);
    } else {
      const promise = this.http
        .get<T>(url, {
          params: params
        })
        .toPromise()
        .then(response => {
          if (response) {
            sessionStorage.setItem(key, JSON.stringify(response));
          }
          return response;
        })
        .catch(error => {
          if (handleError) {
            return this.handleError(error);
          } else {
            return Promise.reject(error);
          }
        });

      return promise;
    }
  }
  

  postData(url: string, data?: any, params?: {}, handleError: boolean = true, ): Observable<object> {
    
    return this.http
      .post(url, data, {
        params: params
      })
      // .toPromise()
      // .catch(error => {
      //   if (handleError) {
      //     return this.handleError(error);
      //   } else {
      //     return Promise.reject(error);
      //   }
      // });
  }

  protected postDataFetchText(url: string, data?: any, params?: any, handleError: boolean = true): Promise<string> {
    return this.http
      .post(url, data, {
        params: params,
        responseType: 'text'
      })
      .toPromise()
      .catch(error => {
        if (handleError) {
          return this.handleError(error);
        } else {
          return Promise.reject(error);
        }
      });
  }
 deleteData(url: string, data?: any, params?: any, handleError: boolean = true, ): Observable<object> {
    return this.http
      .get(url, {
        params: params
      })
    }
  // protected deleteData<T>(url: string, params?: any, handleError: boolean = true): Promise<T> {
  //   return this.http
  //     .delete<T>(url, {
  //       params: params
  //     })
  //     .toPromise()
  //     .catch(error => {
  //       if (handleError) {
  //         return this.handleError(error);
  //       } else {
  //         return Promise.reject(error);
  //       }
  //     });
  // }

  protected sanitizeDate(date: string): string {
    if (date) {
      return date.split('-').join('');
    } else {
      return date;
    }
  }
}
