import { Component, OnInit } from '@angular/core';
import { Setting } from '../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../_models/restaurant/SettingChangeEvent';
import { RestaurantService, AuthService } from '../../_services';
import { CookieService } from 'ngx-cookie-service';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.scss']
})
export class SettingComponent implements OnInit {
  activeTab:number = 1;
  settings: Setting;
  package_id: any;

  constructor(
    private authService: AuthService,
    private restService: RestaurantService,
    private cookieService : CookieService,
    private http: HttpClient,

  ) { }
  subScreenList: any;
  dummy =  '<app-cs-description [firsttab]="settings.firsttab" (onUpdate)="onSubComponentUpdate($event)"></app-cs-description>'

  ngOnInit(): void {
    this.settings = new Setting();
    this.getSettingData();

    // this.package_id = this.cookieService.get('package_id')
    // if(this.package_id !== "null"){
    //   this.getSinglePackages();
    // }
    

  }
  getSinglePackages() {
    this.http.get<any>(`${environment.apiUrl}/admin/v0/package?id=${this.package_id}`)
      .subscribe(
        (res) => {
          this.subScreenList = res.data.access_list.filter(item => item.subscreen === "true");
        },
     
      );
  }

  getSettingData() {
    var params = {
       restaurant_id: this.cookieService.get('default_rest_id'),
    }
    this.restService.getSetting(params).subscribe(res => {
      
      this.settings = res.data;
    })
  }

  onSubComponentUpdate(event: SettingChangeEvent) {

    this.getSettingData();
    this.activeTab = event.tabid;
    // var component = event.component;
    // if(component == 'cs-description') {
    //   this.settings.firsttab = event.setting.firsttab;
    // }else if(component == 'cs-image') {
    //   this.settings.firsttab = event.setting.firsttab;
    // }else if(component == 'cs-information') {
    //   this.settings.information = event.setting.information;
    // }else if(component == 'cs-menu') {

    // }else if(component == 'cs-address') {
    //   this.settings.address = event.setting.address;
    // }
  }
}
