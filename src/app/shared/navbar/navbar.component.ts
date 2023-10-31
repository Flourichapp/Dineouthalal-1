import { Component, OnInit } from '@angular/core';
import { NgbDropdownConfig } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../_services/auth.service';
import { Router } from '@angular/router';
import { common as Const } from '../../_const/common';
import { environment } from '../../../environments/environment';
// import {io} from 'socket.io-client';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  providers: [NgbDropdownConfig]
})

export class NavbarComponent implements OnInit {
  
  // socket = io(environment.apiUrl);

  public iconOnlyToggled = false;
  public sidebarToggled = false;
  public currentUser;
  public isRestaurant = false;
  public isAdmin = false;
  avatar: any;
  imageUrl : any;

  
  public noImg: string = 'assets/images/dummy.jpg';


  constructor(
    config: NgbDropdownConfig,
    private authService: AuthService,
    private router: Router,
    private cookieService : CookieService
  ) {
    config.placement = 'bottom-right';
  }

  ngOnInit() {
    this.currentUser = JSON.parse(this.cookieService.get(Const.USER));
    this.imageUrl = environment.apiUrl

    
    this.avatar = this.currentUser.avatar? (this.imageUrl +'/'+ this.currentUser.avatar): this.noImg;

    var role = this.cookieService.get(Const.ROLE);
    if (role == Const.ROLE_TYPE.RESTAURANT) {
      this.isRestaurant = true;
    }

    // this.socket.on('message', function(data: any) {
    //   // this.getSales();
    //   // this.getChartData();
    //   Notification.requestPermission(function(permission){
    //       var notification = new Notification("Title",{body:'hi',icon:'http://i.stack.imgur.com/Jzjhz.png?s=48&g=1', dir:'auto'});
    //       // setTimeout(function(){
    //           notification.close();
    //       // },5000);
    //   });
    // }.bind(this));
  }

  // toggle sidebar in small devices
  toggleOffcanvas() {
    document.querySelector('.sidebar-offcanvas').classList.toggle('active');
  }

  // toggle sidebar
  toggleSidebar() {
    let body = document.querySelector('body');
    if ((!body.classList.contains('sidebar-toggle-display')) && (!body.classList.contains('sidebar-absolute'))) {
      this.iconOnlyToggled = !this.iconOnlyToggled;
      if (this.iconOnlyToggled) {
        body.classList.add('sidebar-icon-only');
      } else {
        body.classList.remove('sidebar-icon-only');
      }
    } else {
      this.sidebarToggled = !this.sidebarToggled;
      if (this.sidebarToggled) {
        body.classList.add('sidebar-hidden');
      } else {
        body.classList.remove('sidebar-hidden');
      }
    }
  }

  // toggle right sidebar
  toggleRightSidebar() {
    document.querySelector('#right-sidebar').classList.toggle('open');
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/']);
  }

}
