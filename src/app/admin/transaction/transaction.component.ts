import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services';

@Component({
  selector: 'app-transaction',
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {

  constructor(
    private adminService: AdminService
  ) { }

  allTrans: any;  
  all_total:any;
  total: any;
  params = {
    all_pageIndex:0,
    all_pageSize:10,
  }

  ngOnInit(): void {
    this.getDataFromServer();
  }

  handlePageEvent(event){
    this.params.all_pageIndex = event.pageIndex;
    this.params.all_pageSize = event.pageSize;
    this.getDataFromServer()
  }

  getDataFromServer(){
    
    this.adminService.getAllTransactions(this.params).subscribe((res) => {
      this.allTrans = res.data.all;
      this.all_total=res.count;
      this.total = res.data.total;
    })
  }

  changeStatus(e, rest_id) {
  }

}
