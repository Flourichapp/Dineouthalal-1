import { Router, NavigationEnd, NavigationStart, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import { DOCUMENT, isPlatformServer } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Meta } from '@angular/platform-browser';

import { 
  Component, 
  OnInit,
  Inject, 
  Optional, 
  PLATFORM_ID
 } from '@angular/core'
import { REQUEST } from '@nguniversal/express-engine/tokens';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  // title = 'demo1';
  title = 'angular-test';

  data!: string;
  baseURL!: string;
  isServer: Boolean;

  showSidebar: boolean = true;
  showNavbar: boolean = true;
  showFooter: boolean = true;
  showSettings: boolean = true;
  isLoading: boolean;

  constructor(private router: Router, translate: TranslateService, @Inject(PLATFORM_ID) platformId: Object,
  @Optional() @Inject(REQUEST) private request: any,
  @Inject(DOCUMENT) private document: Document,
  private http: HttpClient,private metaTagService: Meta)  {
    this.isServer = isPlatformServer(platformId);

    
    // Removing Sidebar, Navbar, Footer for Documentation, Error and Auth pages
    router.events.forEach((event) => { 
      if(event instanceof NavigationStart) {
        if(event.url === '/rtl') {
          translate.use('ar');
          document.querySelector('body').classList.add('rtl');
        } else {
          // translate.use('en');
          document.querySelector('body').classList.remove('rtl');
        }
        /*
        if((event['url'] == '/user-pages/login') || (event['url'] == '/user-pages/login-2') || (event['url'] == '/user-pages/register') || (event['url'] == '/user-pages/register-2') || (event['url'] == '/user-pages/lock-screen') || (event['url'] == '/error-pages/404') || (event['url'] == '/error-pages/500') ) {
          this.showSidebar = false;
          this.showNavbar = false;
          this.showFooter = false;
          this.showSettings = false;
          document.querySelector('.main-panel').classList.add('w-100');
          document.querySelector('.page-body-wrapper').classList.add('full-page-wrapper');
          if((event['url'] == '/user-pages/login-2') || (event['url'] == '/user-pages/register-2')) {
            document.querySelector('.content-wrapper').classList.add('auth', 'auth-img-bg', );
          } else if(event['url'] == '/user-pages/lock-screen') {
            document.querySelector('.content-wrapper').classList.add('auth', 'lock-full-bg');
          } else {
            document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg', );
            document.querySelector('.content-wrapper').classList.remove('auth', 'lock-full-bg');
          }
          if((event['url'] == '/error-pages/404') || (event['url'] == '/error-pages/500')) {
            document.querySelector('.content-wrapper').classList.add('p-0');
          }
        } else {
          this.showSidebar = true;
          this.showNavbar = true;
          this.showFooter = true;
          this.showSettings = true;
          document.querySelector('.main-panel').classList.remove('w-100');
          document.querySelector('.page-body-wrapper').classList.remove('full-page-wrapper');
          document.querySelector('.content-wrapper').classList.remove('auth', 'auth-img-bg');
          document.querySelector('.content-wrapper').classList.remove('p-0');
        }
        */
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
    // this.metaTagService.addTags([
    //   {
    //     name: 'keywords',
    //     content: 'Angular SEO Integration, Music CRUD, Angular Universal',
    //   },
    //   { name: 'robots', content: 'index, follow' },
    //   { name: 'author', content: 'Digamber Singh' },
    //   { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    //   { name: 'date', content: '2019-10-31', scheme: 'YYYY-MM-DD' },
    //   { charset: 'UTF-8' },
    // ]);
    // Scroll to top after route change
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
          return;
      }
      // window.scrollTo(0, 0);
    });
  }
}
