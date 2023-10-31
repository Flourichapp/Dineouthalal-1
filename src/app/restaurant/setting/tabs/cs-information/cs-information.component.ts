import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestaurantService, AuthService } from '../../../../_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Setting, SettingInformation } from '../../../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../../../_models/restaurant/SettingChangeEvent';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cs-information',
  templateUrl: './cs-information.component.html',
  styleUrls: ['./cs-information.component.scss']
})
export class CsInformationComponent implements OnInit {
  meta: any = {};
  infoForm: UntypedFormGroup;
  @Input()
  // get firsttab(): FirstTab { return this._name; }
  set data(information: SettingInformation) {
    if(information) {
      this.infoForm = this.fb.group({
        venue: [information.venue],
        night: [information.night],
        budget:[information.budget],
        dress:[information.dress],
        music:[information.music],
        covid:[information.covid],
        disabled: [information.disabled],
        minage: information.minage,
      });
    }
  };
  @Output() onUpdate = new EventEmitter<SettingChangeEvent>();

  constructor(
    private resService: RestaurantService,
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private cookieService:CookieService

  ) {
    this.infoForm = this.fb.group({
      venue: [[]],
      night: [[]],
      budget:[0],
      dress:[0],
      music:[[]],
      covid:[0],
      disabled: [[]],
      minage: 0,
    });
   }

  ngOnInit(): void {
    this.getMetaData();
    var select = [];
    
  }

  getMetaData() {
    this.resService.getSettingInformationMetaData().subscribe(data => {
      this.meta = data;
    })
  }

  get f() { return this.infoForm.controls; }

  onSubmit() {
    var params = {
      restaurant_id: this.cookieService.get('default_rest_id'),
      venue: this.f.venue.value,
      night: this.f.night.value,
      music: this.f.music.value,
      dress: this.f.dress.value,
      disabled: this.f.disabled.value,
      minage: this.f.minage.value,
      budget: this.f.budget.value,
      covid: this.f.covid.value,
      settinglevel:3,
    }

    var event = new SettingChangeEvent();
    var setting = new Setting();
    var {restaurant_id, ...information} = params;
    setting.information = information;
    event.tabid = 4;
    event.setting = setting;
    event.component ='cs-information';

    this.resService.updateSettingInformation(params).subscribe(data => {
      // toastr service
      this.toastrService.success("Success");
      this.onUpdate.emit(event);

    });
  }
}
