import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
import { Title, Meta } from '@angular/platform-browser';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogComponent implements OnInit {

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private http:HttpClient,
    private metaTagService: Meta,
    private homeService: HomeService,
    private location: Location
  ) {
   }
  
   currentPath: string;

  blogs: any;
  topblogs: any;
  imageUrl: any;

  blogid = '';
  isLoading = false;

  length = 0;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];


  ngOnInit(): void {
    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)
    this.imageUrl = environment.apiUrl

    var slug = '';
    this.activateRoute.params.subscribe(params => {
      slug = params['slug'];
    });
    this.getBlogData();
  }


  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getBlogData();
  }

  // changeContent(slug){
  //   this.isAll = slug ? true : false;
  //   this.getBlogData(slug);
  // }

  getBlogData(){
    this.isLoading = true;
    var params = {
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    this.http.get<any>(`${environment.apiUrl}/v3/getblogs?&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
    // this.http.get<any>(`${environment.apiUrl}/v3/getblogs`,{params})

      .subscribe(
        (res) => {
         this.blogs = res.blogs;
         this.length = res.count;
         console.log("length",this.length)
         this.topblogs = res.topblogs
         this.isLoading = false;
        },
        error => {
         this.isLoading = false;
        })
  }
}

