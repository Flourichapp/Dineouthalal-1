import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthService } from '../../../_services/auth.service';
import { common as Const } from '../../../_const/common';
import { ConfirmedValidator } from '../../../_helpers';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-restaurant',
  templateUrl: './restaurant.component.html',
  styleUrls: ['./restaurant.component.scss']
})
export class RestaurantComponent implements OnInit {
  signinForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl = '/rest/welcome';
  formVaild = false;
  agreeTC = false;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private cookieService : CookieService,
  ) { }

  ngOnInit(): void {
    this.signinForm = this.formBuilder.group({
      title: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
      agreeTC: [false, Validators.requiredTrue],
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signinForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid      
    if (this.signinForm.invalid) {
      return;
    }

    this.loading = true;
    var params = {
      title:this.f.title.value,
      firstname: this.f.firstname.value,
      lastname: this.f.lastname.value,
      email: this.f.email.value,
      password: this.f.password.value
    }

    this.authService.restaurantRegister(params).subscribe((data) => {
      var res = data as any;
      var user = res.user;
      var token = res.token;

      this.cookieService.set(Const.USER, JSON.stringify(user));
      this.cookieService.set(Const.TOKEN, token);
      this.cookieService.set(Const.IS_ADMIN, 'true');
      this.cookieService.set(Const.ROLE, Const.ROLE_TYPE.RESTAURANT);
  

      this.cookieService.set('package_id', res?.user?.package_id);
      this.cookieService.set('full_access',res?.user?.full_access);


      this.router.navigate([this.returnUrl]);
    }),((err) => {
      this.loading = false;
    });;
  }
}
