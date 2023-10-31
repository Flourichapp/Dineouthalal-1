import { Component, OnInit } from '@angular/core';
import { AdminService, RestaurantService } from '../../_services';
import Swal from 'sweetalert2'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType,HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  dataList: any[];
  editItem: any;
  dataForm: UntypedFormGroup;
  isEdit: boolean = false;
  isNew: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;
  status: boolean;
  imageUrl: string | ArrayBuffer;
  progress: number = 0;
  imageURL : any;

  restId: any;
  selectedFile: File;

  constructor(
    private formBuilder: UntypedFormBuilder,
    protected toastrService: ToastrService,
    private restService: RestaurantService,
    private http: HttpClient,
    private cookieService : CookieService,


  ) {
     this.restId = this.cookieService.get('default_rest_id');
  }

  ngOnInit(): void {

    this.dataList = [];
    this.dataForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      media: [null],
    });

    this.status = true;
    this.imageUrl = null;
    this.getMenu();
    this.imageURL = environment.apiUrl


  }

  getMenu() {
    this.restService.getRestaurantMenu({ rest_id: this.restId }).subscribe(data => {
      this.dataList = data.rows;
    })
  }

  onEdit(item: any) {
    this.submitted = false;
    this.isEdit = true;
    this.isNew = false;
    this.editItem = item;
    this.dataForm = this.formBuilder.group({
      title: [this.editItem.name, Validators.required],
      price: [this.editItem.price, Validators.required],
      description: [this.editItem.description, Validators.required],
      media: [null],
    });
    this.imageUrl = this.editItem.thumbnail;
  }

  onDelete(itemid: number) {
    Swal.fire({
      title: 'Delete Image',
      text: 'You will not be able to recover this imaginary file!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var params = {
          id: itemid
        }
        this.restService.deleteRestaurantMenu(params).subscribe(res => {
          // remove it from there.
          var index = this.dataList.findIndex(obj => {
            return obj.id === itemid;
          })

          this.dataList.splice(index, 1);
        })
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
  get f() { return this.dataForm.controls; }

  onUpdate() {
    // stop here if form is invalid     
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    this.loading = true;
    var params = this.makeParam();
    this.restService.updateRestaurantMenu(params).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          var status = event.body.statusCode;
          if (status == 200) {
          
            Swal.fire({
              title: 'Success',
              text: 'Updated successfully',
              icon: 'success',
              confirmButtonText: 'OK',

            }).then((result) => {
                this.dataList = event.body.data;
            })
          } else {
            var errMsg = event.body.message;
            this.toastrService.warning(errMsg);
          }
          setTimeout(() => {
            this.progress = 0;
          }, 1500);
      }
      this.submitted = false;
      this.loading = false;
      this.isEdit = false;
      this.isNew = false;
    })

  }

  onNew() {
    this.submitted = false;
    this.isEdit = false;
    this.isNew = true;
    this.editItem = {};
    this.dataForm = this.formBuilder.group({
      title: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      media: [null],
    });
    this.imageUrl = null;
  }

  onAdd() {
    // stop here if form is invalid     
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    this.loading = true;
    var params = this.makeParam();

    this.restService.addRestaurantMenu(params).subscribe((event: HttpEvent<any>) => {
      switch (event.type) {
        case HttpEventType.Sent:
          break;
        case HttpEventType.ResponseHeader:
          break;
        case HttpEventType.UploadProgress:
          this.progress = Math.round(event.loaded / event.total * 100);
          break;
        case HttpEventType.Response:
          var status = event.body.code;
          if (status == 200) {
            this.onNew();
            Swal.fire({
              title: 'Success',
              text: 'Inserted successfully',
              icon: 'success',
              confirmButtonText: 'OK',

            }).then((result) => {
                    this.dataList.push(event.body.data);
            })
          } else {
            var errMsg = event.body.message;
            this.toastrService.warning(errMsg);
          }

          setTimeout(() => {
            this.progress = 0;
          }, 1500);

      }
      this.submitted = false;
      this.loading = false;
      
      this.isEdit = false;
      this.isNew = false;
    })
  }
 
  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }
  onUpload() {
    const formData = new FormData();
    formData.append("restaurant_id", this.restId);
    formData.append('file', this.selectedFile, this.selectedFile.name);

    // this.http.put<any>(`${environment.apiUrl}/admin/v0/updateBlogById/${this.id}`, params)

    this.http.put<any>(`${environment.apiUrl}/v1/profile/menu`, formData).subscribe(response => {
      this.submitted = false;
      this.loading = false;
      
      this.isEdit = false;
      this.isNew = false;
      this.getMenu();

    });
  }
  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
      };
    }
    this.dataForm.patchValue({
      media: file
    });
    this.dataForm.get('media').updateValueAndValidity()
  }

  makeParam() {
    var formData: any = new FormData();
    formData.append("id", this.isEdit ? this.editItem.id : '');
    formData.append("title", this.f.title.value);
    formData.append("price", this.f.price.value);
    formData.append("description", this.f.description.value);
    formData.append("media", this.dataForm.value.media);
    formData.append("rest_id", this.restId);
    return formData;
  }
 
}
