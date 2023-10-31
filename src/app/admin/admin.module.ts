import { NgModule } from '@angular/core';

import {SharedModule} from '../shared/shared.module';

import { LoginComponent } from './login/login.component';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CarouselModule } from 'ngx-owl-carousel-o';

import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import {HttpClient} from '@angular/common/http';

import { ChartsModule, ThemeService } from 'ng2-charts';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
// import { SidebarComponent } from '../shared/sidebar/sidebar.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';
import { UserComponent } from './user/user.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingsPanelComponent } from '../shared/settings-panel/settings-panel.component';
import { SettingComponent } from './setting/setting.component';
import { ProfileComponent } from './profile/profile.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { BlogComponent } from './blog/blog.component';
import { GenericSettingComponent } from './setting/tabs/generic-setting/generic-setting.component';
import { SliderSettingComponent } from './setting/tabs/slider-setting/slider-setting.component';
import { AdminCuisineCategoryComponent } from './setting/tabs/admin-cuisine-category/admin-cuisine-category.component';
import { ContactComponent } from './contact/contact.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { MetaTagsComponent } from './meta-tags/meta-tags.component';
import { AccessListComponent } from './access-list/access-list.component';
import { PackagesComponent } from './packages/packages.component';
import { TreeNodeComponent } from './packages/tree-node/tree-node.component';
import { ExampletreeComponent } from './exampletree/exampletree.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}


@NgModule({
  declarations: [
    AdminComponent, 
    DashboardComponent,
    BlogComponent,
    // SidebarComponent,
    // NavbarComponent,
    UserComponent,
    LoginComponent,
    TransactionComponent,
    SettingsPanelComponent,
    SettingComponent,
    ProfileComponent,
    RestaurantsComponent,
    GenericSettingComponent,
    SliderSettingComponent,
    ContactComponent,
    AdminCuisineCategoryComponent,
    BookingsComponent,
    ActivityLogComponent,
    MetaTagsComponent,
    AccessListComponent,
    PackagesComponent,
    TreeNodeComponent,
    ExampletreeComponent,
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
    ChartsModule,
    CarouselModule,
    NgxMapboxGLModule,
    NgbModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
    }
    }),
    PaginationModule.forRoot(),
    FormsModule,
    ReactiveFormsModule
  ]
})
export class AdminModule { }
