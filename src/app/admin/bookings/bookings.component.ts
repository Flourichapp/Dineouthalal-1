import { Component, OnInit } from '@angular/core';
import { AuthService, RestaurantService } from '../../_services';
import { RestTransferService } from '../../_services/rest-transfer.service'
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-bookings',
  templateUrl: './bookings.component.html',
  styleUrls: ['./bookings.component.scss']
})
export class BookingsComponent implements OnInit {

  constructor(  
    private http:HttpClient,
    private router: Router) { }
  length = 20;
  pageIndex= 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  isLoading: Boolean = false;

  AllTransactions: any;

  ngOnInit(): void {
    this.getTransactionData()

  }
  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTransactionData()

  }
  getTransactionData(){
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/v1/gettransactions?pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(
        (res) => {
         this.AllTransactions = res.rows;
         this.length = res.count
        },
        error => {
         this.isLoading = false;
        })
  }
  showDetails(month: string, year: string){
    this.router.navigate(['/rest/transaction/details'], { queryParams: { month, year } });

  }
}
