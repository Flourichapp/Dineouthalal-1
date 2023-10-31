import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ThirdPartyDraggable } from '@fullcalendar/interaction';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/_services';

@Component({
  selector: 'app-slider-setting',
  templateUrl: './slider-setting.component.html',
  styleUrls: ['./slider-setting.component.scss']
})
export class SliderSettingComponent implements OnInit {

  dataForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  config: any;
 

  constructor(
    private formBuilder: UntypedFormBuilder,
    private toastrService: ToastrService,
    private adminService: AdminService
  ) {

    this.dataForm = this.formBuilder.group({
      address: ['', Validators.required],
      city: ['', Validators.required],
      postal_code: ['', [Validators.required]],
      facebook:'',
      twitter:'',
      instagram:'',
      pinterest:'',
      youtube:''
    });
  }

  public foodTypes = [
    { name: 'Halal Certified', value: 'halal_certified', checked:false },
    { name: 'Halal Friendly', value: 'halal_friendly', checked:false },
    { name: 'No Alcohol', value: 'no_alcohol', checked:false }
  ];

  ngOnInit(): void {
    this.adminService.getSettingData({}).subscribe((res)=>{
      if(res && res.length > 0) {
        var address = JSON.parse(res[0].generic);
        this.f.address.setValue(address[0].address);
        this.f.city.setValue(address[0].city);
        this.f.postal_code.setValue(address[0].postal);
        
        var social = JSON.parse(res[0].social);
        this.f.youtube.setValue(social[0].youtube);
        this.f.facebook.setValue(social[0].facebook);
        this.f.twitter.setValue(social[0].twitter);
        this.f.instagram.setValue(social[0].instagram);
        this.f.pinterest.setValue(social[0].pinterest);
      } else {
      }
    })
  }  

  get f() { return this.dataForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.dataForm.invalid) {
      return;
    }

    this.loading = true;
    var params = {
      address: {
        address: this.f.address.value,
        city: this.f.city.value,
        postal: this.f.postal_code.value
      },
      social:{
        facebook: this.f.facebook.value,
        twitter: this.f.twitter.value,
        pinterest: this.f.pinterest.value,
        instagram: this.f.instagram.value,
        youtube: this.f.youtube.value
      }
    }

    this.adminService.updateSettingData(params).subscribe((res)=>{
      this.loading = false;
      this.submitted = false;
      this.toastrService.success('Successed', 'saved');
    }),((err)=>{
      this.loading =false;
      this.submitted =false;
      this.toastrService.error('Some Error Happens', 'saving');
    })
  }

}