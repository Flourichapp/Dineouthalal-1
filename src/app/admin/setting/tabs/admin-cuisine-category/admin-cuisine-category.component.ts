import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../../_services';
import Swal from 'sweetalert2'
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-admin-cuisine-category',
  templateUrl: './admin-cuisine-category.component.html',
  styleUrls: ['./admin-cuisine-category.component.scss']
})

export class AdminCuisineCategoryComponent implements OnInit {
  dataList = [];
  editItem: any;
  dataForm: UntypedFormGroup;
  isEdit: boolean = false;
  isNew: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;
  status: boolean;
  imageUrl: string | ArrayBuffer;
  progress: number = 0;

  constructor(
    private adminService: AdminService,
    private formBuilder: UntypedFormBuilder,
    protected toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    this.dataList = [];
    this.dataForm = this.formBuilder.group({
      title: ['', Validators.required],
      media: [null],
    });
    this.status = true;
    this.imageUrl = null;
    this.getCuisineCategory();
  }

  getCuisineCategory() {
    this.adminService.getCuisineCategorySetting().subscribe(data => {
      this.dataList = data.rows;
    })
  }

  onEdit(item: any) {
    this.submitted = false;
    this.isEdit = true;
    this.isNew = false;
    this.editItem = item;
    this.dataForm = this.formBuilder.group({
      title: [this.editItem.title, Validators.required]
    });
  }

  onDelete(itemid: number) {
    Swal.fire({
      title: 'Delete Cuisine',
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
        this.adminService.deleteCuisineCategorySetting(params).subscribe(res => {
          // remove it from there.
          var index = this.dataList.findIndex(obj => {
            return obj.id === itemid;
          })

          this.dataList[index].deleted_at = new Date().toISOString();
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
    var params = {
      id:this.editItem.id,
      title: this.f.title.value
    };
    this.adminService.updateCuisineCategorySetting(params).subscribe(res => {
    
      if (res.code == '200') {

        this.dataList = res.data;
        this.onNew();
        this.toastrService.success("Successfully Done", 'Success');

      } else {
        this.toastrService.warning(res.message, 'Warning');
      }
      this.submitted = false;
      this.loading = false;      
     
    })

  }

  onNew() {
    this.submitted = false;
    this.isEdit = false;
    this.isNew = true;
    // this.editItem = new CuisineCategory();
    this.dataForm = this.formBuilder.group({
      title: ['', Validators.required],
    });
  }

  onAdd() {
    // stop here if form is invalid     
    this.submitted = true;
    if (this.dataForm.invalid) {
      return;
    }
    this.loading = true;
    var params = {
      title: this.f.title.value
    }

    this.adminService.addCuisineCategorySetting(params).subscribe((res) => {

      if (res.code == '200') {

        this.dataList = res.data;
        this.onNew();
        this.toastrService.success("Successfully Done", 'Success');

      } else {
        this.toastrService.warning(res.message, 'Warning');
      }


     
      this.submitted = false;
      this.loading = false;
    })
  }

  onRestore(itemid: number) {
    Swal.fire({
      title: 'Restore Cuisine',
      text: 'Would you like to undelete this cuisine?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        var params = {
          id: itemid
        }
        this.adminService.restoreCuisineCategorySetting(params).subscribe(res => {
          // remove it from there.
          var index = this.dataList.findIndex(obj => {
            return obj.id === itemid;
          })

          this.dataList[index].deleted_at = null;
        })
        // For more information about handling dismissals please visit
        // https://sweetalert2.github.io/#handling-dismissals
      } else if (result.dismiss === Swal.DismissReason.cancel) {

      }
    })
  }
}
