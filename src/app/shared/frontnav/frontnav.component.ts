import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService, LoginTransferService } from 'src/app/_services';
import { common as Const } from '../../_const/common';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-frontnav',
  templateUrl: './frontnav.component.html',
  styleUrls: ['./frontnav.component.scss']
})
export class FrontnavComponent implements OnInit {

  constructor(
    private authService:AuthService,
    public router: Router,
    private toastrService: ToastrService,
    private loginTransService: LoginTransferService,
    private http: HttpClient,
    private cookieService :CookieService,
  ) { }
  username:any;
  currentUser: any;
  isLoggedIn:Boolean = false;
  isCustomer: Boolean = false;
  isRest: Boolean = false;
  upcomingBooks:any;
  showBadge: Boolean = false;
  isHome: boolean = false;
  imageURL : any;
  isOpen: boolean = false;


  ngOnInit(): void {
    this.isHome = this.router.url === "/"; // Toggle a boolean based on url
this.imageURL = environment.apiUrl
    this.customerCheck()
    this.loginTransService.currentLoggedIn.subscribe(user => {
      if(user){
        this.customerCheck()
      } else {
      }
    })
  }
  toggleSidebar() {
    this.isOpen = !this.isOpen;

  }
  customerCheck(){
    this.isCustomer = this.authService.isCustomer();
    this.isRest = this.authService.isRestOwner();
    if (this.isCustomer || this.isRest) {
      this.currentUser = JSON.parse(this.cookieService.get(Const.USER));
    }
    if (this.isCustomer) {
      // this.getUpComingBook();
    }
  }

  getUpComingBook(){
    this.http.post<any>(`${environment.apiUrl}/v2/getupcomingbooks`, {user_id: this.authService.getUserId()})
      .subscribe(
        (res) => {
         this.upcomingBooks = res;
         if (this.upcomingBooks.length > 0) {
           this.showBadge = true;
         }
         
        },
        error => {
        
        })
  }

  async logout(){
      this.isCustomer = false;
      this.isRest = false;
      this.isOpen= false;
      await this.authService.logout();
      this.router.navigate(['/']);
      this.toastrService.error('You are logged Out', 'Info',{
        timeOut: 1500,
        positionClass:'toast-bottom-right'
      });
  }

}
