import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../_services/auth.service';
import { common as Const } from '../../../_const/common';
import { ToastrService } from 'ngx-toastr';
import { LoginTransferService } from '../../../_services';
import { Location } from '@angular/common';
import { filter, pairwise } from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-customer-login',
  templateUrl: './customer-login.component.html',
  styleUrls: ['./customer-login.component.scss']
})

export class CustomerLoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  forgotPwdForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  isForgotPassword: Boolean;
  previousUrl: string;
  url1: string;
  bookingID: string;

  currentUrl: string = null;


  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toastrService: ToastrService,
    private loginTransService: LoginTransferService,
    private location: Location,
    private cookieService : CookieService
  ) {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  
    const url = this.returnUrl;
    const parts = url.split('?');
    this.url1 = parts[0];
    this.bookingID = parts.length > 1 ? parts[1].split('=')[1] : '';
  
    this.isForgotPassword = false;
    router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        pairwise()
      )
      .subscribe(([prevEvent, currEvent]) => {
        this.previousUrl = (<NavigationEnd>prevEvent).url;
      });

    // Get previous URL
    // this.previousUrl = '/';
    // const history = this.router.config.slice(0, this.router.config.length - 1);
    // for (let i = history.length - 1; i >= 0; i--) {
    //   const route = history[i];
    //   const url = this.router.url.split(';')[0];
    //   if (route.path && url.startsWith('/' + route.path)) {
    //     this.previousUrl = url;
    //     break;
    //   }
    // }
  }

  ngOnInit() {



    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.forgotPwdForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  get f() { return this.loginForm.controls; }
  get fpf() { return this.forgotPwdForm.controls; }

  toggleFogotPassword() {
    this.isForgotPassword = !this.isForgotPassword;
    this.loginForm.controls['email'].setValue('');
    this.loginForm.controls['password'].setValue('');
    this.forgotPwdForm.controls['email'].setValue('');
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    var params = {
      email: this.f.email.value,
      password: this.f.password.value
    }

    this.authService.customerLogin(params).subscribe((data) => {
      this.loading = false;
      var res = data as any;
      var user = res.user;
      var token = res.token;

      this.cookieService.set(Const.USER, JSON.stringify(user));
      this.cookieService.set(Const.TOKEN, token);
      this.cookieService.set(Const.ROLE, Const.ROLE_TYPE.CUSTOMER);
      if(this.bookingID){
      this.router.navigate([this.url1], { queryParams: { id: this.bookingID } });
      }
      else{
        this.router.navigate([this.url1]);

      }

      //  this.router.navigate([this.returnUrl], { queryParams: { id: id }, queryParamsHandling: 'merge' });

      // this.router.navigate([this.returnUrl], { queryParamsHandling: 'preserve' });

      this.toastrService.success('You are Logged In Successfully', 'Info', {
        timeOut: 1500,
        positionClass: 'toast-bottom-right'
      });
      this.loginTransService.changeLoginStatus(user);
    }),((err) => {
      this.loading = false;
    });;
  }

  onSubmitForgotPwdForm() {
    this.submitted = true;

    if (this.forgotPwdForm.invalid) {
      return;
    }

    this.loading = true;
    var params = {
      email: this.fpf.email.value,
    }

    this.authService.forgotPasswordCustomer(params).subscribe((data) => {
      this.loading = false;
      if (data) {
        this.toastrService.success('Mail sent Successfully', 'Success', {
          timeOut: 1500,
          positionClass: 'toast-bottom-right'
        });
      }
    }),((err) => {
      this.loading = false;
    });;
  }
}
