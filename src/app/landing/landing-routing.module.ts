import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingComponent } from './landing.component';
import { HomeComponent } from './home/home.component';
import { AboutusComponent } from './aboutus/aboutus.component';
import { AmbassadorProgramComponent } from './ambassador-program/ambassador-program.component';

import { ContactusComponent } from './contactus/contactus.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SearchComponent } from './search/search.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { PolicyCookyComponent } from './policy-cooky/policy-cooky.component';
import { FaqsComponent } from './faqs/faqs.component';
import { UserComponent } from './user/user.component';
import { CustomerGuard } from '../_helpers';

import { AuthGuard } from '../_helpers';
import { BlogComponent } from './blog/blog.component';
import { BlogDetailComponent } from './blog-detail/blog-detail.component';

const routes: Routes = [
	{
		path: '',
		component: LandingComponent,
		children: [
			//  {
			//  	path: '',
			//  	redirectTo: 'home',
			//  	pathMatch: 'full'
			//  },
			 {
			 	path: '',
			 	component: HomeComponent,
			 	// data: {returnUrl: window.location.pathname}
			 },
			{
				path: 'login',
				component: LoginComponent,
				canActivate:[AuthGuard]
				// data: {returnUrl: window.location.pathname}
			},
			{
				path: 'register',
				component: RegisterComponent,
				// data: {returnUrl: window.location.pathname}
			},
			{
				path: 'about-us',
				component: AboutusComponent
			},
			{
				path: 'ambassador',
				component: AmbassadorProgramComponent
			},
			{
				path: 'contact-us',
				component: ContactusComponent
			},
			{
				path: 'search',
				component: SearchComponent
			},
			{
				path: 'terms-conditions',
				component: TermsConditionsComponent
			},
			{
				path: 'privacy-policy',
				component: PolicyCookyComponent
			},
			{
				path: 'faqs',
				component: FaqsComponent
			},
			{
				path: 'restaurant',
				loadChildren: () => import('./rest/rest.module').then(m => m.RestModule),
			},
			{
				path: 'blogs',
				component: BlogComponent,
				// runGuardsAndResolvers: 'always'
			},
			{
				path: 'blog/:slug',
				component: BlogDetailComponent,
				// runGuardsAndResolvers: 'always'
			},
			{
				path: 'profile/:tabname',
				component: UserComponent,
				loadChildren: () => import('./user/user.module').then(m => m.UserModule),

				 canActivate:[CustomerGuard]

			},

		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LandingRoutingModule { }
