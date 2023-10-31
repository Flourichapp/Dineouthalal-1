import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';
@Component({
  selector: 'app-terms-conditions',
  templateUrl: './terms-conditions.component.html',
  styleUrls: ['./terms-conditions.component.scss']
})
export class TermsConditionsComponent implements OnInit {

  constructor(
    private homeService: HomeService,
    private location: Location
  ) { }
  currentPath: string;

  ngOnInit(): void {
    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)
  }

}
