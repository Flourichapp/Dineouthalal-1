import { NgModule, LOCALE_ID } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { RestaurantRoutingModule } from './restaurant-routing.module';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';
import { ImageCropperModule } from 'ngx-image-cropper';
import { DataTablesModule } from "angular-datatables";
import { DayPilotModule } from "daypilot-pro-angular";
import { FullCalendarModule } from '@fullcalendar/angular';
import { AmazingTimePickerModule } from '@jonijnm/amazing-time-picker';
import { ChartsModule } from 'ng2-charts';
import { NgxStripeModule } from 'ngx-stripe';

import { RestaurantComponent } from './restaurant.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingComponent } from './booking/booking.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingComponent } from './setting/setting.component';
import { TransactionComponent } from './transaction/transaction.component';
// import { NavbarComponent } from '../shared/navbar/navbar.component';
import { CsDescriptionComponent } from './setting/tabs/cs-description/cs-description.component';
import { CsImageComponent } from './setting/tabs/cs-image/cs-image.component';
import { CsInformationComponent } from './setting/tabs/cs-information/cs-information.component';
import { CsAddressComponent } from './setting/tabs/cs-address/cs-address.component';
import { CsOpentimeComponent } from './setting/tabs/cs-opentime/cs-opentime.component';
import { CsMenuComponent } from './setting/tabs/cs-menu/cs-menu.component';
import { CsOfferComponent } from './setting/tabs/cs-offer/cs-offer.component';
import { SpinnerComponent } from '../shared/spinner/spinner.component';
import { env } from '../config';
import { ReviewsComponent } from './reviews/reviews.component';
import { SeatsComponent } from './seats/seats.component';
import { TmpComponent } from './tmp/tmp.component';
import { PayComponent } from './transaction/pay/pay.component';
import { MenuComponent } from './menu/menu.component';
import { SubcriptionsComponent } from './subcriptions/subcriptions.component';
import { TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  declarations: [
    RestaurantComponent,
    DashboardComponent,
    BookingComponent,
    ProfileComponent,
    SettingComponent,
    TransactionComponent,
    // NavbarComponent,
    CsDescriptionComponent,
    CsImageComponent,
    CsInformationComponent,
    CsAddressComponent,
    CsOpentimeComponent,
    CsMenuComponent,
    CsOfferComponent,
    SpinnerComponent,
    ReviewsComponent,
    SeatsComponent,
    TmpComponent,
    PayComponent,
    MenuComponent,
    SubcriptionsComponent,
    TransactionDetailsComponent,
    WelcomeComponent,
  ],
  imports: [
    SharedModule,
    DataTablesModule,
    ImageCropperModule,
    RestaurantRoutingModule,
    NgSelectModule,
    DayPilotModule,
    FullCalendarModule,
    AmazingTimePickerModule,
    ChartsModule,

    AgmCoreModule.forRoot({
      apiKey: env.GoogleMapApiKey
    }),
    NgxStripeModule.forRoot(env.STRIPE_KEY),
  ],
  providers: [
    GoogleMapsAPIWrapper,
    { provide: LOCALE_ID, useValue: 'en' }
  ]
})
export class RestaurantModule { }
