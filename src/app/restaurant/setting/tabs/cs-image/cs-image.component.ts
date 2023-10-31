import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { RestaurantService, AuthService } from '../../../../_services';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Setting, SettingImage } from '../../../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../../../_models/restaurant/SettingChangeEvent';
import Swal from 'sweetalert2'
import { param } from 'jquery';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cs-image',
  templateUrl: './cs-image.component.html',
  styleUrls: ['./cs-image.component.scss']
})
export class CsImageComponent implements OnInit {

  arrFile: string[] =[];
  imageURL : any;
  form: UntypedFormGroup;
  progress: number = 0;
  imageUrl: string | ArrayBuffer;
  _images: SettingImage[] = [];

  public noImg: string = 'media/static/no-img.png';

  @Input()
  // get firsttab(): FirstTab { return this._name; }
  set images(images: SettingImage[]) {
    this._images = images;
  };

  @Input() thumbnail: string;
  @Input() mainlogo: string;

  @Output() onUpdate = new EventEmitter<SettingChangeEvent>();

  isLoading: Boolean = false;

  imageChangedEvent: any = '';
  croppedImage: any = '';

  constructor(
    private resService: RestaurantService,
    public fb: UntypedFormBuilder,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private cookieService:CookieService

  ) {
    this.form = this.fb.group({
      restaurant_id: [''],
      media: [null]
    })
  }

  slideConfig = {
    "slidesToShow": 5,
    "slidesToScroll": 1,
    "nextArrow": "<i class='fa fa-arrow-left slick-next'></i>",
    "prevArrow": "<i class='fa fa-arrow-right slick-prev'></i>",
    "dots": true,
    "infinite": false,
    "arrows": true,
    "autoplay": true,
    "autoplaySpeed": 3000,
    "lazyLoad": 'ondemand',
  };

  ngOnInit(): void {
    
     this.imageURL = environment.apiUrl
  }

  uploadGalleries(){
    if (!this.form.value.media){
      Swal.fire({
        title: 'No Images',
        text: 'Please Select at Least One Image!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
      }).then((result) => {});
      return;
    }

    this.resService.uploadGalleries(
      parseInt(this.cookieService.get('default_rest_id')),
      this.form.value.media
    ).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          this.toastrService.success('Success', 'success');
          setTimeout(() => {
            this.progress = 0;
            // this.fullmenus = event.body;
            this._images = event.body.image;

            document.querySelector('input').value = '';
          }, 1000);
      }
    })
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.arrFile = [];
    var files =(event.target as HTMLInputElement).files;
    Array.from(files).forEach(file => { 
      this.arrFile.push(file.name);
    });

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
      };
    }
    this.form.patchValue({
      media: files
    });
    this.form.get('media').updateValueAndValidity()
  }

  uploadImage(kind) {
    if (this.croppedImage == this.noImg) {
      Swal.fire({
        title: 'Can\'t Upload Image',
        text: 'Please Choose Image file!',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'OK',
        cancelButtonText: 'No'
      }).then((result) => {
        if (result.value) {
        } else if (result.dismiss === Swal.DismissReason.cancel) {
        }
      })
      return;
    }
    this.isLoading = true;
    var rest_id = parseInt(this.cookieService.get('default_rest_id'));
    if (kind == 'thumbnail') {
      this.resService.uploadThumbnail(
        rest_id,
        this.croppedImage
      ).subscribe(a => {
        this.modalService.dismissAll();
        setTimeout(() => {
          this.thumbnail = a.storyurl;
          this.isLoading = false;
        }, 1000);
        this.toastrService.success("Thumbnail Uploaded Successfully", 'Success');
      })
    } else {
      this.resService.uploadGallayImg(
        rest_id,
        this.croppedImage,
        kind,
      ).subscribe(a => {
        this.modalService.dismissAll();
        
        this.isLoading = false;
        if (kind == 'gallary') {
          setTimeout(() => {
            this._images.push(a.url);
          }, 1000);
        } else if(kind == 'mainlogo') {
          setTimeout(() => {
            this.mainlogo = a.url;
          }, 1000);
        }
        this.toastrService.success("New Image Added", 'Success');
      })

    }
  }

  onDeleteThumbnail(kind) {

    var rest_id = this.cookieService.get('default_rest_id');
    var urlArr = [];
    if(kind == 'mainlogo') {
      urlArr = this.mainlogo.split(rest_id);
    } else {
      urlArr = this.thumbnail.split(rest_id);
    }
    
    var filename = '';
    if (urlArr.length > 1) {
      filename = urlArr[1].replace(/\\/g, '');
    }
    if (filename == '') {
      return;
    }
    
    
    Swal.fire({
      title: 'Delete Thumbnail',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        this.isLoading = true;

        var params = {
          rest_id: rest_id,
          filename: filename,
          kind: kind
        }
        this.resService.deleteThumbnail(params).subscribe(res => {
          setTimeout(() => {
            if(kind == 'mainlogo') {
              this.mainlogo = this.noImg;
            } else {
              this.thumbnail = this.noImg;
            }
            this.isLoading = false;
          }, 1000);
          this.toastrService.success('Successfully deleted', 'Success');
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
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
}
