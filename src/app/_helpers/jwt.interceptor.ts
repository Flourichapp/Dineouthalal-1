import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService , private cookieService: CookieService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        // const token = this.authenticationService.getToken();

        const token = this.cookieService.get('TOKEN');

        

        // const isApiUrl = request.url.startsWith('/api');
        const isStripeUrl = request.url.startsWith('https://api.stripe.com/');
        


        if (token && !isStripeUrl) {

            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${token}`
                }
            });
        }

        
        return next.handle(request);
    }
}
