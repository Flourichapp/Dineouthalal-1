import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../_services/auth.service';
import { common as Const } from '../../../_const/common';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-restaurant-login',
  templateUrl: './restaurant-login.component.html',
  styleUrls: ['./restaurant-login.component.scss']
})

export class RestaurantLoginComponent implements OnInit {
    loginForm: UntypedFormGroup;
    forgotPwdForm: UntypedFormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    isForgotPassword: Boolean;
    package_id: any;


    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService : AuthService,
        private toastrService: ToastrService,
        private cookieService :CookieService
    ) { 
        // redirect to home if already logged in
        this.returnUrl = '/rest/welcome';
        if(this.authService.isLoggedIn() ) {
            // this.router.navigate([this.returnUrl]);
        }
        this.isForgotPassword = false;
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],//test@restaurant.com
            password: ['', Validators.required]//123
        });
        
    this.forgotPwdForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
      });

        // get return url from route parameters or default to '/'
        // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }
    get fpf() { return this.forgotPwdForm.controls; }

    onSubmit() {
      // alert('here');
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        var params = {
            email: this.f.email.value,
            password: this.f.password.value
        }
        
        this.authService.restaurantLogin(params).subscribe((data)=>{
            this.loading = false;
            var res = data as any;
            var user = res.user;
            var token = res.token;

            this.cookieService.set(Const.USER, JSON.stringify(user));
            this.cookieService.set(Const.TOKEN, token);
            this.cookieService.set(Const.ROLE, Const.ROLE_TYPE.RESTAURANT);
            this.cookieService.set('package_id', res?.user?.package_id);
            this.cookieService.set('full_access',res?.user?.full_access);
            this.package_id = this.cookieService.get('package_id')
            if(this.package_id !== 'null'){
              this.returnUrl = '/rest/welcome';

            }
            else{
              this.returnUrl = '/rest/welcome';

            }



            this.router.navigate([this.returnUrl]);
          }),((err)=> {
              this.loading = false;
          });;
    }

    toggleFogotPassword() {
        this.isForgotPassword = !this.isForgotPassword;
        this.loginForm.controls['email'].setValue('');
        this.loginForm.controls['password'].setValue('');
        this.forgotPwdForm.controls['email'].setValue('');
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
    
        this.authService.forgotPasswordVendor(params).subscribe((data) => {
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
