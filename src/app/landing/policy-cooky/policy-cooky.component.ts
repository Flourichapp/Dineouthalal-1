import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-policy-cooky',
  templateUrl: './policy-cooky.component.html',
  styleUrls: ['./policy-cooky.component.scss']
})
export class PolicyCookyComponent implements OnInit {

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
