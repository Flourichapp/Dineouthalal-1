import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user.component';
import { SharedModule } from '../../shared/shared.module';

const routes: Routes = [
  { path: ':tabname', component: UserComponent },
];


@NgModule({
  declarations: [UserComponent],
  imports: [
 SharedModule,
    RouterModule.forChild(routes),  ]
})
export class UserModule { }
