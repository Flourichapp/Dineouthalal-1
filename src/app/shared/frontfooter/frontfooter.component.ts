import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-frontfooter',
  templateUrl: './frontfooter.component.html',
  styleUrls: ['./frontfooter.component.scss']
})
export class FrontfooterComponent implements OnInit {

  constructor(    private http: HttpClient,
    ) { }
    socialMediaLinks: any;
    facebookUrl: string;
    instagramUrl: string;
    youtubeUrl: string;

  ngOnInit(): void {
    // this.http.post<any>(`${environment.apiUrl}/admin/v0/getsettingdata/`, {})
    // .subscribe(
    //   (response) => {
    //     const social = JSON.parse(response.data[0].social);
    //     this.facebookUrl = social[0].facebook;
    //     this.instagramUrl = social[0].instagram;
    //     this.youtubeUrl = social[0].youtube;
       

    //   },
    //   error => {

    //   })
  }

}
