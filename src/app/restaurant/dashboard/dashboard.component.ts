import { Component, OnInit } from '@angular/core';
import { AuthService, RestaurantService, RestTransferService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor(
    private restService: RestaurantService,
    private authService: AuthService,
    private restTransferService: RestTransferService,
    private cookieService : CookieService,
  ) { }
  imageUrl : any;

  areaChartLabels = [];
  areaChartData = [];  
  bookings = [];
  today_booking: number = 0;
  today_customer: number = 0;
  today_review: number = 0;
  gallary = [];
  offerMenu = [];
  reviews = [];

  ngOnInit(): void {
    

      
 
      

      let params = {
        rest_id: this.cookieService.get('default_rest_id') 
      }

      this.restService.getDashboardData(params).subscribe((res)=>{
      
        this.areaChartLabels = res.data.daterange;
        this.areaChartData = [{
          label: 'Created',
          data: res.data.booking_created,
          borderWidth: 1,
          fill: true
        },
        {
          label: 'Booking',
          data: res.data.daily_booking,
          borderWidth: 1,
          fill: true
        }];
  
        this.today_booking = res.data.today_booking;
        this.today_customer = res.data.today_customers;
        this.today_review = res.data.today_reviews;
        this.bookings = res.data.bookings;
        this.gallary = res.data.gallaries;
        this.reviews = res.data.reviews;
        this.offerMenu = JSON.parse(res.data.rest[0].offer_menu);
  
      })
    this.imageUrl = environment.apiUrl;


    
    
  }

}
