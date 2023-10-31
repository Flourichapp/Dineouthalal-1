import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/_services';
import { HttpClient } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-restaurants',
  templateUrl: './restaurants.component.html',
  styleUrls: ['./restaurants.component.scss']
})
export class RestaurantsComponent implements OnInit {

  constructor(
    private adminService: AdminService,
    private toastrService: ToastrService,
    private modalService: NgbModal,
    private http: HttpClient,
  ) { }

  approvingRests: any[];
  AllRest:any;
  imageURL:any;
  allRests: any;  
  pendingRests: any;  
  statusOptions = ['pending', 'approving', 'approved'];
  selectedStatus: string = 'pending';

  approving_total:any;
  all_total:any;
  params = {
    approve_pageIndex:0,
    approve_pageSize:10,
    all_pageIndex:0,
    all_pageSize:10,
    pending_pageIndex:0,
    pending_pageSize:10,



  }
  loading = false;
  FullAccess :any;
  selectedRest: any;

  ngOnInit(): void {
    this.getDataFromServer();
    this.imageURL = environment.apiUrl
  }

  handlePageEvent(event){

    this.params.approve_pageIndex = event.pageIndex;
    this.params.approve_pageSize = event.pageSize;
    this.getDataFromServer()
  }

  handlePageEvent2(event){
    this.params.all_pageIndex = event.pageIndex;
    this.params.all_pageSize = event.pageSize;
    this.getDataFromServer()
  }
  changeAccess(e,rest_id ,rest_status) {
    const status = e.checked
    if (status === true) {
      this.FullAccess = 1
    } else {
      this.FullAccess = 0
    }
    var data = {
      rest_id: rest_id,
      full_access: this.FullAccess,
    }
    this.adminService.updateRestStatus(data).subscribe((res) =>{
     

      this.toastrService.success('Successed', 'updated');
    }),((err)=>{
      this.toastrService.error('Server Error', 'error');
    });
  }

  getDataFromServer(){
    
    this.adminService.getAllRestsByAdmin(this.params).subscribe((res) => {
      this.AllRest = res.data;
      this.all_total = res.count;

      // this.allRests = res.all;
      // this.approvingRests = res.approving;
      // this.all_total=res.all_total;
      // this.approving_total = res.approving_total;
      // this.pendingRests = res.pendingRes;
     

    })
  }
  

  changeStatus(e, rest_id) {
    var data = {
      rest_id: rest_id,
      status: e
    }
    this.adminService.updateRestStatus(data).subscribe((res) =>{
     

      this.toastrService.success('Successed', 'updated');
    }),((err)=>{
      this.toastrService.error('Server Error', 'error');
    });
  }

  openDetailModal(content, item) {
    
    
    this.loading = true;
   this.adminService.getRestDetail({rest_id:item.restaurant_id}).subscribe((res)=>{
    this.selectedRest = res?.data;
  //   if(this.selectedRest?.rest?.foodTypes ){
  //    this.selectedRest.rest.foodTypes = JSON.parse(this.selectedRest?.rest?.food_types).join(', ').replace('_', ' ');
  //  }
    this.loading = false;
    
    this.modalService.open(content, { size: "lg", windowClass: 'custom-delete-modal-class' ,centered: true,  });

   });
  }


  slideConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": false,
    "arrows": true,
    // "autoplay": true,
    // "autoplaySpeed": 3000,
    "responsive": [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };
}
