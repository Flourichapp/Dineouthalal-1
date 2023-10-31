import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { LandingRoutingModule } from './landing-routing.module';

import { CarouselModule } from 'ngx-owl-carousel-o';

import { LandingComponent } from './landing.component';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { ContactusComponent } from './contactus/contactus.component';
import { FrontnavComponent } from '../shared/frontnav/frontnav.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { CustomerComponent } from './register/customer/customer.component';
import { RestaurantComponent } from './register/restaurant/restaurant.component';
import { CustomerLoginComponent } from './login/customer-login/customer-login.component';
import { RestaurantLoginComponent } from './login/restaurant-login/restaurant-login.component';
import { FrontfooterComponent } from './../shared/frontfooter/frontfooter.component';
import { SearchComponent } from './search/search.component';
import { BlogComponent } from './blog/blog.component';

import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { DatePipe } from '@angular/common';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PolicyCookyComponent } from './policy-cooky/policy-cooky.component';
import { FaqsComponent } from './faqs/faqs.component';

import { env } from '../config';
// import { UserComponent } from './user/user.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';
import { AmbassadorProgramComponent } from './ambassador-program/ambassador-program.component';

@NgModule({
  declarations: [
    LandingComponent, 
    HomeComponent, 
    AboutusComponent, 
    ContactusComponent,
    FrontnavComponent,
    LoginComponent,
    RegisterComponent,
    CustomerComponent,
    RestaurantComponent,
    CustomerLoginComponent,
    RestaurantLoginComponent,
    FrontfooterComponent,
    SearchComponent,
    TermsConditionsComponent,
    PolicyCookyComponent,
    FaqsComponent,
    // UserComponent,
    BlogComponent,
    BlogDetailComponent,
    AmbassadorProgramComponent
  ],
  imports: [
    SharedModule,
    LandingRoutingModule,
    CarouselModule,

    AgmCoreModule.forRoot({apiKey: env.GoogleMapApiKey}),
  ],
  providers: [
    GoogleMapsAPIWrapper,
    DatePipe
  ],
})
export class LandingModule { }
