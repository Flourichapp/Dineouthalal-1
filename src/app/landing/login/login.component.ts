import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../_services/auth.service';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {

  public isCustomer: Boolean;
  public isVendor: Boolean;

  constructor(   
     private homeService: HomeService,
     private location: Location

    ) { 
    
  }
  currentPath: string;

  ngOnInit() {
    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)
    this.isCustomer = true;
    this.isVendor = false;
  }

  isVendorClick(e) {
    this.isVendor = e;
    this.isCustomer = !e;
  }
}
