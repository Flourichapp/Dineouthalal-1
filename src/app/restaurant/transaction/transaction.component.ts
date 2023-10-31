import { Component, OnInit } from '@angular/core';
import { AuthService, RestaurantService } from '../../_services';
import { RestTransferService } from '../../_services/rest-transfer.service'
import Swal from 'sweetalert2';
import { HttpClient } from '@angular/common/http';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  constructor(
    private restService: RestaurantService,
    private restTransferService: RestTransferService,
    private modalService: NgbModal,
    private authService: AuthService,
    private toastService: ToastrService,
    private http:HttpClient,
    private router: Router,
    private cookieService : CookieService

  ) { }

  trans: any;
  message: any;
  monthly_flag: any = 'monthly';
  _showPaymentSide: Boolean = false;
  expiredAt: any;
  isLoading: Boolean = false;

  AllTransactions: any;


  payemntStatus: any;
  stripeData: any;
  submitted: any;
  loading: any;

  restId = this.cookieService.get('default_rest_id');

  length = 20;
  pageIndex= 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];



  
  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getTransactionData()

  }

  ngOnInit(): void {
    this.getTransactionData()
  }

  getTransactionData(){
    this.isLoading = true;
    this.http.get<any>(`${environment.apiUrl}/v1/gettransactions?restaurant_id=${this.restId}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
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
