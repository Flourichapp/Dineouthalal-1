import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';
import { ServiceBase } from './service-base.service';
import { Meta, Title } from '@angular/platform-browser';


@Injectable({ providedIn: 'root' })

export class HomeService extends ServiceBase {

    constructor(protected toastrService: ToastrService, protected http: HttpClient ,protected cookieService :CookieService ,   
      private metaTagService: Meta,
      private pageTitleService: Title,
    ) {
      super(toastrService, http , cookieService);
    }

    getLandingPageData() {
      return this.postData(`${environment.apiUrl}/v3/getlangingpagedata`)
    }
    
    getLandingPageBlogs() {
      return this.postData(`${environment.apiUrl}/v3/blogs/featured`)
    }
    getLandingPageCuisine() {
      return this.postData(`${environment.apiUrl}/admin/v0/getcuisinecategory`)
    }
    getLandingPagePopularRests(city) {
      return this.postData(`${environment.apiUrl}/v3/restaurants?city=${city}`)
    }
   getMetaDataByRouteName(routeName): void {
    const encodedRouteName = decodeURIComponent(routeName);

    this.getData(`${environment.apiUrl}/v3/getsinglemetadata?routername=${encodedRouteName}`)
        .subscribe(
          (res) => {
            if(res['rows'] && res['rows'].length) {
              const { title } = res['rows'][0];
              const { description, type, image, url } = JSON.parse(res['rows'][0].meta); 
            
            this.pageTitleService.setTitle(title);
            this.metaTagService.updateTag({
              name: 'title',
              content: title,
            });
            this.metaTagService.updateTag({
              name: 'description',
              content: description,
            });
        
            this.metaTagService.updateTag({
              name: 'og:title',
              content: title,
            });
            this.metaTagService.updateTag({
              name: 'og:description',
              content: description,
            });
            this.metaTagService.updateTag({
              name: 'og:type',
              content: type,
            });
            this.metaTagService.updateTag({
              name: 'og:url',
              content: url,
            });
            this.metaTagService.updateTag({
              name: 'og:image',
              content: image
            });
          }
       
        
         
          })
    }

}