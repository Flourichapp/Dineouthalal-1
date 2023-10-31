import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { common as Const } from '../../_const/common';

import { AuthService } from '../../_services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

@Component({ templateUrl: 'login.component.html' })
export class LoginComponent implements OnInit {
    loginForm: UntypedFormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: UntypedFormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authService : AuthService,
        private toastr: ToastrService,
        private cookieService: CookieService
    ) { 
        // redirect to home if already logged in
        if(this.authService.isLoggedIn() && this.authService.isAdmin()) {
            this.router.navigate(['/admin']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]//test
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin/dashboard';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
      // alert('here');
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
        }

        this.loading = true;
        var params = {
            email: this.f.email.value,
            password: this.f.password.value
        }
        this.authService.adminlogin(params).subscribe((data) => {
            this.loading = false;
            var res = data as any;
            var user = res.user;
            var token = res.token;
            this.cookieService.set(Const.USER, JSON.stringify(user));
            this.cookieService.set(Const.TOKEN, token);
            this.cookieService.set(Const.ROLE, Const.ROLE_TYPE.ADMIN);
            this.router.navigate([this.returnUrl]);
   
      
     
            this.toastr.success('You are Logged In Successfully', 'Info', {
              timeOut: 1500,
              positionClass: 'toast-bottom-right'
            });
          }),((err) => {
            this.loading = false;
            this.toastr.error('Authentication', 'Invalid login credentials')
          })
        }
    
    }

