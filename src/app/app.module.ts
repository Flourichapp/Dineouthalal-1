import { BrowserModule } from '@angular/platform-browser';   
import { NgModule, CUSTOM_ELEMENTS_SCHEMA  } from '@angular/core';
import {HttpClientModule, HttpClient, HTTP_INTERCEPTORS} from '@angular/common/http';
// import { JwtModule } from "@auth0/angular-jwt";
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { DatePipe } from '@angular/common';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChartsModule, ThemeService } from 'ng2-charts';
import {CookieService} from 'ngx-cookie-service';

// import { CarouselModule } from 'ngx-owl-carousel-o';
// import { NgxMapboxGLModule } from 'ngx-mapbox-gl';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';

import { FrontnavComponent } from './shared/frontnav/frontnav.component';
import { environment } from '../environments/environment';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { common as Const } from './_const/common';
import { RestaurantComponent } from './restaurant/restaurant.component';
import { SafeHtmlPipePipe } from './_helpers/safe-html-pipe.pipe';
import { env } from './config';
import { NgxStripeModule } from 'ngx-stripe';
import {JwtInterceptor} from './_helpers/jwt.interceptor';

import 'add-to-calendar-button';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}

declare module "@angular/core" {
  interface ModuleWithProviders<T = any> {
    ngModule: Type<T>;
    providers?: Provider[];
  }
}

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    AppComponent,
    // SafeHtmlPipePipe,
    // RestaurantComponent,
    // LandingComponent,
    // FrontnavComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    // SharedModule,
    // NgbModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    // ChartsModule,
    // CarouselModule,
    // NgxMapboxGLModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
    }),
    // JwtModule.forRoot({
    //   config: {
    //     tokenGetter: () => {
    //     },
    //     allowedDomains: [ environment.ALLOW_DOMAIN]
    //   }
    // }),
    // NgxStripeModule.forRoot(
    //   env.STRIPE_KEY
    // )

    
    // AgmCoreModule.forRoot({apiKey: 'AIzaSyAz1x12T1P8nDYur8yxDPOSV061vMV_TxY'}),
    // AgmCoreModule.forRoot({apiKey: 'AIzaSyAz1x12T1P8nDYur8yxDPOSV061vMV_TxY'}),
    // MatModule
    // AdminModule,
  ],
  providers: [
    ThemeService,
    DatePipe,
    CookieService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    }
    // GoogleMapsAPIWrapper
  ],
  bootstrap: [AppComponent]
})
export class AppModule{}
