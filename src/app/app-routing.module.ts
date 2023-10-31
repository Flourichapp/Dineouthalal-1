import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard, AdminAuthGuard, RestOwnerGuard } from './_helpers';
import { LandingComponent } from './landing/landing.component';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./landing/landing.module').then(m => m.LandingModule),
    // component: LandingComponent,
    // canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
  },
  {
    path: 'rest',
    loadChildren:() => import('./restaurant/restaurant.module').then(m => m.RestaurantModule),
     canActivate:[RestOwnerGuard]
  },
  // {
  //   path: 'admin',
  //   component: DashboardComponent,
  //   children: [
  //     {
  //       path: '',
  //       redirectTo: 'dashboard',
  //       pathMatch: 'full'
  //     },
  //     { path: 'dashboard', component: DashboardComponent },
  //     { path: 'basic-ui', loadChildren: () => import('./basic-ui/basic-ui.module').then(m => m.BasicUiModule) },
  //     { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsDemoModule) },
  //     { path: 'forms', loadChildren: () => import('./forms/form.module').then(m => m.FormModule) },
  //     { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
  //     { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
  //     { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
  //     { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },

  //   ]
  // },

  // otherwise redirect to home
  { path: '**', redirectTo: '' }
];


// const routes1: Routes = [
//   { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
//   { path: 'dashboard', component: DashboardComponent },
//   { path: 'basic-ui', loadChildren: () => import('./basic-ui/basic-ui.module').then(m => m.BasicUiModule) },
//   { path: 'charts', loadChildren: () => import('./charts/charts.module').then(m => m.ChartsDemoModule) },
//   { path: 'forms', loadChildren: () => import('./forms/form.module').then(m => m.FormModule) },
//   { path: 'icons', loadChildren: () => import('./icons/icons.module').then(m => m.IconsModule) },
//   { path: 'apps', loadChildren: () => import('./apps/apps.module').then(m => m.AppsModule) },
//   { path: 'user-pages', loadChildren: () => import('./user-pages/user-pages.module').then(m => m.UserPagesModule) },
//   { path: 'error-pages', loadChildren: () => import('./error-pages/error-pages.module').then(m => m.ErrorPagesModule) },
// ];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', initialNavigation: 'enabledBlocking' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
