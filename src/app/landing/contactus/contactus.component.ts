import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Title, Meta } from '@angular/platform-browser';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contactus',
  templateUrl: './contactus.component.html',
  styleUrls: ['./contactus.component.scss']
})

export class ContactusComponent implements OnInit {
  contactForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';


  currentPath: string;

  constructor(
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private homeService: HomeService,
    private location: Location,
    private metaTagService: Meta

  ) {
    // redirect to home if already logged in

  }

  ngOnInit() {
    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)

    this.contactForm = this.formBuilder.group({
      userType: [null, Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
  }
 

  // convenience getter for easy access to form fields
  get f() { return this.contactForm.controls; }

  // onSubmit() {
  //   // alert('here');
  //   this.submitted = true;

  //   // stop here if form is invalid
  //   if (this.contactForm.invalid) {
  //     return;
  //   }

  //   this.loading = true;
  //   var params = this.makeParam();
  //   let options = {
  //     headers: new HttpHeaders().set('Content-Type', 'multipart/form-data')

  // };
  //   this.http.post<any>(`${environment.apiUrl}/v3/contact`,params,options)
  //   .subscribe(
  //     (res) => {
  //     params
  //       this.loading = false;

  //       this.toastr.success('Sucessfully Contact', 'Thanks');

  //     },
  //     error => {
  //       this.loading = false;
  //         this.toastr.error('Something Went Wrong, please try later', 'Error');

  //     })


  // }
  onSubmit() {
    const headers = new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded');
    const body = new URLSearchParams();
    body.set('username', this.f.username.value);
    body.set('email', this.f.email.value);
    body.set('message', this.f.message.value);
    body.set('userType', this.f.userType.value);

    this.http.post<any>(`${environment.apiUrl}/v3/contact`, body.toString(), { headers }).subscribe(
      (res) => {
        this.toastr.success('Sucessfully Contact us', 'Thanks');
        this.contactForm = this.formBuilder.group({
          userType: [null, Validators.required],
          username: ['', Validators.required],
          email: ['', [Validators.required, Validators.email]],
          message: ['', Validators.required],
        });
      },
      (error) => {
        console.error(error);
        this.toastr.error('Something Went Wrong, please try later', 'Error');

      }
    );
  }


}

