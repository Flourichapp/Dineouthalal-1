import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RestaurantComponent } from './restaurant.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookingComponent } from './booking/booking.component';
import { ProfileComponent } from './profile/profile.component';
import { TransactionComponent } from './transaction/transaction.component';
import { SettingComponent } from './setting/setting.component';
import { ReviewsComponent } from './reviews/reviews.component';
import { SeatsComponent } from './seats/seats.component';
import { RestOwnerGuard } from '../_helpers/rest-owner.guard';
import { RouteAccessGuard } from '../_helpers/route-access.guard'; // Import the guard

import { TmpComponent } from './tmp/tmp.component';
import { MenuComponent } from './menu/menu.component';
import { SubcriptionsComponent } from './subcriptions/subcriptions.component';
import {TransactionDetailsComponent } from './transaction-details/transaction-details.component';
import { WelcomeComponent } from './welcome/welcome.component';


const routes: Routes = [
	{
		path: '',
		component: RestaurantComponent,
		canActivate: [RestOwnerGuard, RouteAccessGuard], 
		children: [
			{
				path: '',
				redirectTo: 'dashboard',
				pathMatch: 'full'
			},
			{
				path: 'tmp',
				component: TmpComponent,
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
			},
			{
				path: 'booking',
				component: BookingComponent,
			},
			{
				path: 'profile',
				component: ProfileComponent,
			},
			{
				path: 'transaction',
				component: TransactionComponent,
			},
			{
				path: 'detail',
				component: SettingComponent,
			},
			{
				path: 'seats',
				component: SeatsComponent,
			},
			{
				path: 'menu',
				component: MenuComponent,
			},
			{
				path: 'reviews',
				component: ReviewsComponent,
			},
			{
				path: 'subscription',
				component: SubcriptionsComponent,
			},
			{
				path: 'transaction/details',
				component: TransactionDetailsComponent,
			},
			{
				path: 'welcome',
				component: WelcomeComponent,
			},
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class RestaurantRoutingModule { }
