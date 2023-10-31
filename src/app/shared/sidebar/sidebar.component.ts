import { Component, Input, OnInit,HostListener,ChangeDetectorRef , ElementRef } from '@angular/core';
import { common as Const } from '../../_const/common';
import { AuthService, RestaurantService } from '../../_services';
import { RestTransferService } from "../../_services/rest-transfer.service";
import { CookieService } from 'ngx-cookie-service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventService } from '../../restaurant/event.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent implements OnInit {
  public eventSubscription: Subscription;

  public userCollapsed = false;
  public uiBasicCollapsed = false;
  public uiAdvancedCollapsed = false;
  public formsCollapsed = false;
  public editorsCollapsed = false;
  public chartsCollapsed = false;
  public tablesCollapsed = false;
  public iconsCollapsed = false;
  public mapsCollapsed = false;
  public userPagesCollapsed = false;
  public errorCollapsed = false;
  public generalPagesCollapsed = false;
  public eCommerceCollapsed = false;
  public isRestaurant = false;
  public isAdmin = false;

  constructor(
    private restTservice: RestTransferService,
    private authService: AuthService,
    private cookieService :CookieService,
    private router: Router,
    private http: HttpClient,
    private eventService: EventService

  ) { 
    
    this.package_id = this.cookieService.get('package_id')
   
  
  }


  public currentUser;
  restName: any;
  reststatus: any;
  showTabs: boolean = false;
  disableTabs: boolean = true;
  package_id:any
  loading:any;
  length = null;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
    AccessList:any;
  accessListIds:any;
  filteredAccessListIds:any;
  correspondingScreen:any;
  pathNamesWithoutRest:any;
  acceesList:any;
  full_access:any;

  ngOnInit() {
    this.full_access = this.cookieService.get('full_access')
    this.eventSubscription = this.eventService.getEvent().subscribe(event => {
      this.package_id = this.cookieService.get('package_id')
 
      if (this.package_id !== 'null'){
        this.getSinglePackages()

      }
      else{
        this.acceesList = [];

      }

    });
  

 

    this.restTservice.currentRest.subscribe(rest => {
      if(rest){
        var _restInfo = JSON.parse(rest);
        this.restName = _restInfo.title;
        this.reststatus = _restInfo.status;
      } else {
        var rest_status = this.cookieService.get('rest_status');
        this.reststatus = rest_status;
        this.restName = this.cookieService.get('rest_name');
      }
    })
    this.currentUser = JSON.parse(this.cookieService.get(Const.USER));

    var role = this.cookieService.get(Const.ROLE);
    if (role == Const.ROLE_TYPE.RESTAURANT) {
      this.isRestaurant = true;
    }


    this.isAdmin = this.authService.isAdmin();

    const body = document.querySelector('body');

    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    document.querySelectorAll('.sidebar .nav-item').forEach(function (el) {
      el.addEventListener('mouseover', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.add('hover-open');
        }
      });
      el.addEventListener('mouseout', function () {
        if (body.classList.contains('sidebar-icon-only')) {
          el.classList.remove('hover-open');
        }
      });
    });
    if(this.package_id !== 'null'){
      this.getSinglePackages()
    }

  }
 

  ngOnDestroy() {
    this.eventSubscription.unsubscribe();
  }
  getSinglePackages() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/admin/v0/package?id=${this.package_id}`)
      .subscribe(
        (res) => {
          this.acceesList = res.data.access_list?.filter(item => item.subscreen === "false");

        },
        error => {
          this.loading = false;
        }
      );
  }
  isItemDisabled(url: string): boolean {
    if(this.full_access === "0"){
      const urlExists = this.acceesList?.some(item => item.url === url);
      return !urlExists;
    }
  
   
    
  }
  menuItems: any[] = [

    { screen_name: 'Dashboard', url: '/rest/dashboard',slug:'dashboard' },
    { screen_name: 'Bookings', url: '/rest/booking' ,slug:'booking' },
    { screen_name: 'Reviews', url: '/rest/reviews',slug:'reviews'  },
    { screen_name: 'Seats', url: '/rest/seats',slug:'seats'  },
    { screen_name: 'Menus', url: '/rest/menu',slug:'menus'  },
    { screen_name: 'General Setting', url: '/rest/detail',slug:'general-setting'  },
    { screen_name: 'Transaction', url: '/rest/transaction',slug:'transaction'  },
  
  ];
  
  changeRoute(url: string) {
  
    if(this.full_access === "1"){

      this.router.navigate([url]);

    }
    else{
    if(this.acceesList){
      for (const menuItem of this.acceesList) {
        if (menuItem.url === url) {
          this.router.navigate([url]);
          break; 
        }
      }
    }
  }
   
  }


  
  toggleTabs() {
    this.showTabs = !this.showTabs;
  }
 

}
