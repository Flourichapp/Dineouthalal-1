import { Component, OnInit } from '@angular/core';
import { AuthService, RestaurantService, RestTransferService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {

  constructor(  private restService: RestaurantService,
    private authService: AuthService,
    private restTransferService: RestTransferService,
    private cookieService : CookieService,) { }
   
    ngOnInit(): void {
    

      this.restService.getRestInfoByUserId().subscribe((res:any) => {
        
        var id = this.cookieService.get('default_rest_id') ? this.cookieService.get('default_rest_id') : res.rests[0].restaurant_id;
        this.restTransferService.changeRest(JSON.stringify(res[0]));
        this.cookieService.set('default_rest_id', id);
        this.cookieService.set('rest_status', res.rests[0].status);
        this.cookieService.set('rest_name', res.rests[0].title);
  
        
  
     
       
      })
  
  
      
      
    }

}
