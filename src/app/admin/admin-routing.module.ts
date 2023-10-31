import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserComponent } from './user/user.component';
import { AdminAuthGuard } from '../_helpers';
import { LoginComponent } from './login/login.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingComponent } from './setting/setting.component';
import { ProfileComponent } from './profile/profile.component';
import { RestaurantsComponent } from './restaurants/restaurants.component';
import { BlogComponent } from './blog/blog.component';
import { BookingsComponent } from './bookings/bookings.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { MetaTagsComponent } from './meta-tags/meta-tags.component';
import { AccessListComponent } from './access-list/access-list.component';
import { PackagesComponent } from './packages/packages.component';
import { ExampletreeComponent } from './exampletree/exampletree.component';


const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AdminAuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'restaurants',
        component: RestaurantsComponent,
      },
      {
        path: 'user/:id',
        component: UserComponent,
      },
      {
        path: 'transaction',
        component: TransactionComponent,
      },
      {
        path: 'setting',
        component: SettingComponent,
      },
      {
        path: 'profile',
        component: ProfileComponent,
      },
      {
        path: 'blogs',
        component: BlogComponent,
      },
      {
        path: 'customers',
        component: UserComponent,
      },
      {
        path: 'bookings',
        component: BookingsComponent,
      },
      {
        path: 'activitylog',
        component: ActivityLogComponent,
      },
      {
     
        path: 'metatags',
        component: MetaTagsComponent,
      },
      {
     
        path: 'accesslist',
        component: AccessListComponent,
      },
      {
     
        path: 'packages',
        component: PackagesComponent,
      },
      {
     
        path: 'exampletree',
        component: ExampletreeComponent,
      },
      
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
