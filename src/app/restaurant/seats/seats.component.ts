import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { RestaurantService } from 'src/app/_services';
import Swal from 'sweetalert2';
import { AuthService } from '../../_services/auth.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-seats',
  templateUrl: './seats.component.html',
  styleUrls: ['./seats.component.scss']
})

export class SeatsComponent implements OnInit {

  seats: any = [];

  removedIds:any=[];

  rest_id: any;
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private restService: RestaurantService,
    private toastService: ToastrService,
    private cookieService : CookieService,
  ) {
    this.rest_id = this.cookieService.get('default_rest_id');
  }


  ngOnInit(): void {
    this.restService.getRestSeats({rest_id: this.rest_id}).subscribe(res=>{
      this.seats = res.rows
    })
  }
  

  addNew(){
    this.seats.push({
      id:'',
      table_no:'',
      option:'standard',
      seat_count: '',
      status:'empty'
    })
  }

  remove(index, seatId){
    if(seatId != '') {
      this.removedIds.push(seatId);
    }
    this.seats.splice(index, 1);

  }

  saveAll(){
    var newSeats = this.seats.filter(s=>{
      if(s.id == '') return s;
    })
    if(this.removedIds.length == 0 && newSeats.length == 0) {
      Swal.fire({
        title:'No Changes',
        icon:'warning',
      })
      return;
    }
    let params = {
      rest_id: this.rest_id,
      newSeats: JSON.stringify(newSeats),
      removeIds: JSON.stringify(this.removedIds),
    }
    this.restService.updateRestSeat(params).subscribe(res=>{
      this.removedIds = [];
      this.toastService.success('Success', 'success');
      this.seats = res.rows;
    })

  }

}
