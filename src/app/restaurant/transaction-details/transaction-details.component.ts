import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-transaction-details',
  templateUrl: './transaction-details.component.html',
  styleUrls: ['./transaction-details.component.scss']
})
export class TransactionDetailsComponent implements OnInit {

  constructor(    
    private http:HttpClient,
    private route: ActivatedRoute,
    private cookieService: CookieService
    ) { }
    AllBookings: any;
    isLoading: Boolean = false;
    restId = this.cookieService.get('default_rest_id');
    length = null;
    pageIndex= 0;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    month :any
    year : any
    bookingCharge = 1;

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
       this.month = params['month'];
       this.year = params['year'];
      
      // Use the values as needed
  
    });

    this.getTransactionData()
  }
  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTransactionData()

  }
  getTransactionData(){
    this.isLoading = true;
    // var params = {
    //   pageSize: this.pageSize,
    //   pageIndex: this.pageIndex
    // }
    this.http.get<any>(`${environment.apiUrl}/v1/getbookingHistory/${this.restId}?month=${this.month}&year=${this.year}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(
        (res) => {
         this.AllBookings = res.data;
         this.length = res.allcount

        },
        error => {
         this.isLoading = false;
        })
  }
}
