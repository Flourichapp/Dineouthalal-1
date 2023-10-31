import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.scss']
})
export class AboutusComponent implements OnInit {

  constructor(
    private metaTagService: Meta,
    private homeService: HomeService,
    private location: Location

  ) { }

 
  currentPath: string;

  ngOnInit(): void {
    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)

  }



}
