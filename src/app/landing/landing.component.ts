import { Component, OnInit } from '@angular/core';
// import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})

export class LandingComponent implements OnInit {

  // isLoggin = false;
  constructor() { }

  ngOnInit(): void {
    // this.isLoggin = this.authService.isLoggedIn();
  }

  

  // gotoTop(): void{
  //    window.scrollTo(0,0);
  // }

//   toogleScroolButton(): void {
//     if (window.screenY > 300 ) {
//      }
// }

}
