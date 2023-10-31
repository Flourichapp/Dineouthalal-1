import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { HomeService } from '../../_services';
@Component({
  selector: 'app-blog-detail',
  templateUrl: './blog-detail.component.html',
  styleUrls: ['./blog-detail.component.scss']
  
})
export class BlogDetailComponent implements OnInit {

 
  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private http:HttpClient,
    private homeService: HomeService,
    private location: Location
  ) {
   }
  blogs: any;
  topblogs: any;
  imageUrl: any;
  blogid = '';
  isLoading = false;

  length = 0;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  currentPath: string;


  ngOnInit(): void {
    this.currentPath = this.location.path();
    const encodedPath = encodeURIComponent(this.currentPath);

    this.homeService.getMetaDataByRouteName(encodedPath)
    this.imageUrl = environment.apiUrl

    var slug = '';
    this.activateRoute.params.subscribe(params => {
      slug = params['slug'];
    });
    this.getBlogData(slug);
  }

  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getBlogData(e);
  }

  changeContent(slug){
    this.getBlogData(slug);
  }

  getBlogData(slug: any){
    this.isLoading = true;
    var params = {
      slug: slug,
      pageSize: this.pageSize,
      pageIndex: this.pageIndex
    }
    const encodedSlug = encodeURIComponent(slug);

    this.http.get<any>(`${environment.apiUrl}/v3/getblogs?pageIndex=1&pageSize=${this.pageSize}${encodedSlug ? '&slug='+encodedSlug : ''}`)

    // this.http.get<any>(`${environment.apiUrl}/v3/getblogs`,{params})

      .subscribe(
        (res) => {
         this.blogs = res.blogs;
         this.length = res.total;
         this.topblogs = res.topblogs
         this.isLoading = false;
        },
        error => {
         this.isLoading = false;
        })
  }
}

