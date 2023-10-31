import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';
import { Routes, RouterModule } from '@angular/router';
import { AgmCoreModule, GoogleMapsAPIWrapper } from '@agm/core';

import { RestComponent } from './rest.component';

import { env } from '../../config';

const routes: Routes = [
  { path: ':restname', component: RestComponent },
];

@NgModule({
  declarations: [RestComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    AgmCoreModule.forRoot({apiKey: env.GoogleMapApiKey}),
  ],
  providers: [
    GoogleMapsAPIWrapper
  ],
})
export class RestModule { }
