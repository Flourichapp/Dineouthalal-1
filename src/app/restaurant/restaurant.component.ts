// import { isLoweredSymbol } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { AuthService, RestaurantService } from '../_services';
import { CookieService } from 'ngx-cookie-service';
import { EventService } from '../restaurant/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})

export class RestaurantComponent implements OnInit{
  public eventSubscription: Subscription;

  packageId: string = "initial_value"; 

  // Event handler to update package_id
  updatePackageId(newPackageId: string) {
    this.packageId = newPackageId;
  }
  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  showSettings: boolean = true;
  isLoading: boolean;
  disableScreen: boolean = true;
  package_id: any;
  full_access : any

  constructor(
    private router: Router, translate: TranslateService, 
    private authService: AuthService,
    private restService: RestaurantService,
    private cookieService :CookieService,
    private eventService: EventService


    )  {

    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
    router.events.forEach((event) => { 
      if(event instanceof NavigationStart) {
        if(event.url === '/rtl') {
          translate.use('ar');
          document.querySelector('body').classList.add('rtl');
        } else {
          translate.use('en');
          document.querySelector('body').classList.remove('rtl');
        }
      }
    });

    // Spinner for lazyload modules
    router.events.forEach((event) => { 
      if (event instanceof RouteConfigLoadStart) {
          this.isLoading = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.isLoading = false;
      }
    });
  }



  ngOnInit() {
    this.full_access = this.cookieService.get('full_access')

    this.eventSubscription = this.eventService.getEvent().subscribe(event => {
      this.package_id = this.cookieService.get('package_id')

      if (this.package_id !== 'null' ){
        this.disableScreen = false;

      }
      else{
        this.disableScreen = true;

      }

    });
    this.package_id = this.cookieService.get('package_id')

    if(this.package_id !== "null"  || this.full_access === "1"){
      this.disableScreen = false;
    }

    
    // this.restService.getRestInfoByUserId().then(
    //   (res)=>{
    //     if(res.length > 0) {
    //     }
    //   }
    // )
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      // window.scrollTo(0, 0);
    });
  }
  ngtabcontent(){

  }
}
