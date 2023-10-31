import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { RestaurantService, AuthService } from '../../../../_services';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { SettingImage, Setting } from '../../../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../../../_models/restaurant/SettingChangeEvent';
import Swal from 'sweetalert2'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

interface OfferMenu{
  content:string,
  price:string
}

@Component({
  selector: 'app-cs-menu',
  templateUrl: './cs-menu.component.html',
  styleUrls: ['./cs-menu.component.scss']
})


export class CsMenuComponent implements OnInit {

  arrFile: string[] =[];
  form: UntypedFormGroup;
  progress: number = 0;
  imageUrl: string | ArrayBuffer;
  fullmenus: SettingImage[] = [];
  offermenus = [];

  selectedImg = '';
  @Input() menu: any ;
  @Output() onUpdate = new EventEmitter<SettingChangeEvent>();

  constructor(
    private resService: RestaurantService,
    public fb: UntypedFormBuilder,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private cookieService: CookieService
    ){
      this.form = this.fb.group({
        restaurant_id: [''],
        media: [null]
      })
    }

  ngOnInit(): void {
    this.fullmenus = this.menu.fullmenu != null ?JSON.parse(this.menu.fullmenu):[];
    this.offermenus = this.menu.offermenu != null ?JSON.parse(this.menu.offermenu): [];
  }
  addOfferMenuItem(){
    var new_off :OfferMenu = {
      content:'',
      price:''
    }
    this.offermenus.push(new_off);
  }

  removeOfferMenuItem(index){
    this.offermenus.splice(index, 1);
  }
  updateOfferMenu(){
    var params = {
      rest_id: this.cookieService.get('default_rest_id'),
      offermenu: JSON.stringify(this.offermenus),
    }
    this.resService.updateOfferMenu(params).subscribe(res=>{

      var event = new SettingChangeEvent();
      // var setting = new Setting();
      // var updated = new FirstTab(this.f.title.value, this.f.shortdescription.value, this.f.fulldescription.value);
      // setting.firsttab = updated;
      event.tabid = 4;
      // event.setting = setting;
      // event.component ='cs-description';
      this.onUpdate.emit(event);

      this.toastrService.success('Success', 'success');
    })
  }

  openGallaryModal(content, imgsrc) {
    this.modalService.open(content, { centered: true });
    this.selectedImg = imgsrc;
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

  uploadImage() {
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

    this.resService.uploadSettingMenu(
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
            this.fullmenus = event.body;
            document.querySelector('input').value = '';
          }, 1000);
      }
    })
  }

  onDelete(imagename) {
    Swal.fire({
      title: 'Delete Image',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {

        var new_full_menus = this.fullmenus.filter(item=>{
          if (item != imagename) return item;
        });


        var rest_id = this.cookieService.get('default_rest_id');
        var urlArr = imagename.split(rest_id);
        var filename = '';
        if (urlArr.length > 1) {
          filename = urlArr[1].replace(/\\/g, '');
        }
        if (filename == '') {
          return;
        }


        var params = {
          rest_id: rest_id,
          fullmenu: JSON.stringify(new_full_menus),
          deletedmenu: filename
        }
        this.resService.deleteSettingFullMenu(params).subscribe(res=>{
         
          this.fullmenus = new_full_menus;
          this.toastrService.success('Success', 'success');
        })
      // For more information about handling dismissals please visit
      // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    })
  }
}
