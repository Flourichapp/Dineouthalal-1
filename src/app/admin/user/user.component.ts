
import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/_services';
import { saveAs } from 'file-saver';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private http: HttpClient,


  ) { }

  users: any;  
  filterUser: any;
  pagiDate: any;
  all_total:any;
  btnText:  String = "Export CSV";
  userName: any;
  userId: any;
  isLoading: Boolean = false;

  params = {
    all_pageIndex:0,
    all_pageSize:10,
  }

  ngOnInit(): void {
  this.getuser()

  }
getuser(){
  this.adminService.getSubscribers().subscribe((res) => {
    this.users = res.rows;
    this.all_total = res.rows.length;
    this.getDataByPagination();
    this.filterUser = res.rows.map(({ first_name, email }) => ({ first_name, email }));

  })
}
  handlePageEvent(event){
    this.params.all_pageIndex = event.pageIndex;
    this.params.all_pageSize = event.pageSize;
    this.getDataByPagination()
  }

  getDataByPagination(){

    this.pagiDate = this.users.filter((item, index)=>{
      if (index >= this.params.all_pageIndex * this.params.all_pageSize && index < (this.params.all_pageIndex + 1) * this.params.all_pageSize) return item;
    })
    
  }
  showDiv() {
    const moreInfoDiv = document.getElementById('moreInfo');
    if (moreInfoDiv.style.display === 'none') {
      moreInfoDiv.style.display = 'block';
    } else {
      moreInfoDiv.style.display = 'none';
    }
  }
  openDeleteModal(content, user) {
    this.modalService.open(content, { centered: true });
    this.userName = `${user.first_name}  ${user.last_name}`
    this.userId = user.id
  }
  deleteUser() {
 
   this.isLoading = true;
    this.modalService.dismissAll();
    this.http.delete<any>(`${environment.apiUrl}/v2/auth/remove/${this.userId}` )
      .subscribe(
        (res) => {
          this.toastrService.success('Successfully Deleted User', 'success', {
            timeOut: 1500
          })
          this.getuser()
          this.isLoading = false;

        },
        error => {
        })
  }
  changeStatus(e, type, id) {
  }

    downloadFile(users: any) {
      const replacer = (key, value) => value === null ? '' : value; 
      const header = Object.keys(users[0]);
      let csv = users.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
      csv.unshift(header.join(','));
      let csvArray = csv.join('\r\n');
  
      var blob = new Blob([csvArray], {type: 'text/csv' })
      saveAs(blob, "myFile.csv");
  }

}
