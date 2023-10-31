import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public isCustomer: Boolean;
  public isVendor: Boolean;

  constructor(
    private route: ActivatedRoute,
    private homeService: HomeService,
    private location: Location
  ) {}
  currentPath: string;

  ngOnInit() {
    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)
    this.isCustomer = true;
    this.isVendor = false;

    this.route.queryParams.subscribe(params => {
      let vendor = params['vendor'];
      let customer = params['vendor'];
      if (vendor == 'true') {
        this.isVendor = true;
        this.isCustomer = false;
      } else if (customer == 'true') {
        this.isVendor = false;
        this.isCustomer = true;
      }

    });

  }

  isVendorClick(e) {
    this.isVendor = e;
    this.isCustomer = !e;
  }

}
