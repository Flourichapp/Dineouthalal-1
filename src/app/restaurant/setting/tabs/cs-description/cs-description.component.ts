import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { RestaurantService, AuthService, AdminService } from '../../../../_services';
import { FirstTab, Setting } from '../../../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../../../_models/restaurant/SettingChangeEvent';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cs-description',
  templateUrl: './cs-description.component.html',
  styleUrls: ['./cs-description.component.scss']
})
export class CsDescriptionComponent implements OnInit {


  dataForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  config: any;
  cuisineArr = [];

  @Input()

  set firsttab(firsttab: FirstTab) {

    if(firsttab.food_types) {
      this.updateCheckbox(firsttab.food_types);
    }
    this.dataForm = this.formBuilder.group({
      title: [firsttab.title, Validators.required],
      shortdescription: [firsttab.shortdescription, Validators.required],
      cuisine:[firsttab.cuisine, [Validators.required, Validators.min(1) ]],
      fulldescription: [firsttab.fulldescription, [Validators.required]],
      average_price:[firsttab.average_price, [Validators.required, Validators.min(1) ]],
      food_types: [firsttab.food_types?firsttab.food_types:[]],
    });
  }

  @Output() onUpdate = new EventEmitter<SettingChangeEvent>();

  constructor(
    private formBuilder: UntypedFormBuilder,
    private resService: RestaurantService,
    private authService: AuthService,
    private adminService: AdminService,
    private toastrService: ToastrService,
    private cookieService:CookieService
  ) {
  }

  public foodTypes = [
    { name: 'Halal Certified', value: 'halal_certified', checked:false },
    { name: 'Halal Friendly', value: 'halal_friendly', checked:false },
    { name: 'No Alcohol', value: 'no_alcohol', checked:false }
  ];

  ngOnInit(): void {

    this.adminService.getCuisineCategorySetting().subscribe((res)=>{
      this.cuisineArr = res.rows.filter((item)=>{
        if(item.deleted_at == null) return item;
      })
    })
    this.config = {
      placeholder: '',
      tabsize: 2,
      height: '200px',
      toolbar: [
        ['misc', ['codeview', 'undo', 'redo']],
        // ['style', ['bold', 'italic', 'underline', 'clear']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
        ['insert', ['table', 'link', 'hr']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    }
  }
  
  updateCheckbox(values){
    var selectedTypes = values;//JSON.parse(values);
    for(let i in this.foodTypes) {
      if(selectedTypes.indexOf(this.foodTypes[i].value) >= 0){
        this.foodTypes[i].checked = true;
      }
    }
  }

  get f() { return this.dataForm.controls; }

  onCheckChange(event) {
    const foodArr = this.dataForm.get('food_types');
    if(event.checked){
      foodArr.value.push(event.source.value);
    }
    else{
      let i: number = 0;  
      foodArr.value.forEach((ctrl) => {
        if(ctrl == event.source.value) {
          foodArr.value.splice(i, 1);
          return;
        }
        i++;
      });
    }
  }

  onSubmit() {
    
    this.submitted = true;

    if (this.dataForm.invalid) {
      return;
    }

    this.loading = true;
    var params = {
      title: this.f.title.value,
      shortdescription: this.f.shortdescription.value,
      fulldescription: this.f.fulldescription.value,
      settinglevel: 1,
      restaurant_id: this.cookieService.get('default_rest_id'),
      average_price: this.f.average_price.value,
      cuisine: this.f.cuisine.value,
      food_types: JSON.stringify(this.f.food_types.value)
    }

    this.resService.updateSetting(params).subscribe((data) => {
      this.loading = false;
      this.toastrService.success('Successed', 'saved');
      
      var event = new SettingChangeEvent();
      var setting = new Setting();
      var updated = new FirstTab(this.f.title.value, this.f.shortdescription.value, this.f.fulldescription.value);
      setting.firsttab = updated;
      event.tabid = 1;
      event.setting = setting;
      event.component ='cs-description';
      this.onUpdate.emit(event);

    },(err) => {
      this.toastrService.error('Some Error Happens', 'Error');
      this.loading = false;
    })
  }
}
