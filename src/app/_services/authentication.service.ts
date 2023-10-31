import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../environments/environment';
import { User } from '../_models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient ,private cookieService : CookieService) {
        if(this.cookieService.get('currentUser') !== ""){
            this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(this.cookieService.get('currentUser')));   
            this.currentUser = this.currentUserSubject.asObservable();
        }
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    public getToken(): string {
        return this.cookieService.get('token');
    }

    login(username: string, password: string) {
        return this.http.post<any>(`${environment.apiUrl}/auth/authenticate`, { username, password })
            .pipe(map(user => {
                // store user details and jwt token in local storage to keep user logged in between page refreshes
                this.cookieService.set('currentUser', JSON.stringify(user));
                this.cookieService.set('token', user.token);
                this.currentUserSubject.next(user);
                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        this.cookieService.delete('currentUser');
        this.currentUserSubject.next(null);
        console.log("customer logout")
    }
}