import { Component, OnInit } from '@angular/core';
import { RestaurantService } from 'src/app/_services';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {

  constructor(
    private restService: RestaurantService,
    private cookieService : CookieService,
  ) { }

  length = null;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  params = {
    rest_id: this.cookieService.get('default_rest_id'),
    pageIndex: 0,
    pageSize: 10,
  };

  reviews;

  ngOnInit(): void {
    this.getTotalReviews()
  }  

  changePage(e){
      this.params.pageIndex = e.pageIndex;
      this.params.pageSize = e.pageSize;
      this.getTotalReviews();
    
  }

  getTotalReviews(){
    this.restService.getTotalReviews(this.params).subscribe((res)=>{
      this.length = res.data.totalReview;
      this.reviews = res.data.reviews;
    })
  }

}
