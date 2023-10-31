import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from "@angular/forms";
import { RestaurantService, AuthService } from '../../_services';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Setting, SettingImage } from '../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../_models/restaurant/SettingChangeEvent';
import Swal from 'sweetalert2'
import { param } from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { common as Const } from '../../_const/common';
import { ConfirmedValidator } from '../../_helpers';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  form: UntypedFormGroup;
  progress: number = 0;
  imageUrl: string | ArrayBuffer;
  _images: SettingImage[] = [];

  public noImg: string = 'assets/images/dummy.jpg';

  mainlogo: string = this.noImg;


  isLoading: Boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';
  _changepwd: boolean= false;

  constructor(
    private resService: RestaurantService,
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private cookieService : CookieService,
    
  ) {
    var user = this.authService.getUser();
    this.imageUrl = environment.apiUrl


    this.mainlogo = user.avatar? (this.imageUrl +"/"+ user.avatar):this.noImg;


    this.signinForm = this.formBuilder.group({
      firstname: [user.first_name, Validators.required],
      lastname: [user.last_name, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      changepwd:[false],
      password: [''],
      confirm_password: ['']
  }, { 
    validator: ConfirmedValidator('password', 'confirm_password')
  });
  this.signinForm.controls['email'].disable()
  }

  signinForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  formVaild = false;
  agreeTC = false;

  // convenience getter for easy access to form fields
  get f() { return this.signinForm.controls; }

  ngOnInit(): void {
    this.signinForm.get('changepwd').valueChanges.subscribe(val => {
      this._changepwd = val;
      if (val) {
        this.signinForm.controls['password'].setValidators([Validators.required]);
      } else {
        this.signinForm.controls['password'].clearValidators();
      }
      this.signinForm.controls['password'].updateValueAndValidity();
    });
    this.imageUrl = environment.apiUrl
  }

  uploadImage() {
    this.mainlogo = this.croppedImage;
    this.modalService.dismissAll();
    
  }

  openCropModal(content) {
    this.modalService.open(content, { centered: true });
    this.imageChangedEvent = '';
    this.croppedImage = this.noImg;
  }

  fileChangeEvent(event: any): void {
    this.imageChangedEvent = event;
  }
  
  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage = event.base64;
  }

  onDelete(image_id) {
    Swal.fire({
      title: 'Delete Image',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        var index = this._images.findIndex(obj => {
          return obj.id === image_id;
        })
        var rest_id = this.cookieService.get('default_rest_id');
        var urlArr = this._images[index].url.split(rest_id);
        var filename = '';
        if (urlArr.length > 1) {
          filename = urlArr[1].replace(/\\/g, '');
        }
        if (filename == '') {
          return;
        }
        var params = {
          rest_id: rest_id,
          imageid: image_id,
          filename: filename
        }
        this.resService.deleteGallayImg(params).subscribe(res => {
          this._images.splice(index, 1);
          this.toastrService.success('Successfully Deleted', 'Success');
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }

  // for image cropper
  imageLoaded() { }
  cropperReady() { }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid      
    if (this.signinForm.invalid) {
        return;
    }

    this.loading = true;
    var params = {
        user_id: this.authService.getUserId(),
        firstname:this.f.firstname.value,
        lastname: this.f.lastname.value,
        email: this.f.email.value,
        password: this.f.password.value,
        avatar: this.croppedImage
    }
    
    this.resService.updateProfile(params).subscribe((data)=>{
        this.loading = false;   
        this.cookieService.set(Const.USER, JSON.stringify(data));
        this.toastrService.success("Profile Updated Successfully", 'Success');
        // location.reload();
      }),((err)=> {
          this.loading = false;
      });;
}
}
