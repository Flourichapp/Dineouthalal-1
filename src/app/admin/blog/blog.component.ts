import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';

import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AdminService, AuthService, RestaurantService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})

export class BlogComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasCover') canvasCoverRef: ElementRef<HTMLCanvasElement>;


  constructor(
    private http: HttpClient,

    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private adminService: AdminService,
    private toastrService: ToastrService,
    private modalService: NgbModal,

  ) {
    this.dataForm = this.formBuilder.group({
      blog: ['', Validators.required],
      title: ['', Validators.required],

      thumbnail: [null],
      cover_image: [null],


    });
  }

  blogForm: UntypedFormGroup;
  dataForm: UntypedFormGroup;
  featuredBlog: Boolean = false;
  imageURL: any;
  errorMessege: any;

  coverUrl: any;
  submitted: Boolean = false;
  loading: Boolean = false;
  summernoteConfig: any;
  postedblogs: any;
  addNew = false;
  isEdit = false;
  editItem: any;
  imageUrl: string | ArrayBuffer;
  thumbnail: any;
  restId: any;
  id: any;
  total = 0;
  pageSize = 10;


  ngOnInit(): void {
    this.summernoteConfig = {
      placeholder: '',
      tabsize: 2,
      height: '270px',
      toolbar: [
        ['misc', ['codeview', 'undo', 'redo']],
        ['font', ['bold', 'italic', 'underline', 'strikethrough', 'superscript', 'subscript', 'clear']],
        ['fontsize', ['fontname', 'fontsize', 'color']],
        ['para', ['style', 'ul', 'ol', 'paragraph', 'height']],
        ['insert', ['picture', 'link', 'video', 'hr']]
      ],
      fontNames: ['Helvetica', 'Arial', 'Arial Black', 'Comic Sans MS', 'Courier New', 'Roboto', 'Times'],
    }
    this.adminService.getBlogsByUserId({
      "pageIndex": 1,
      "pageSize": 10
    }).subscribe((res) => {
      this.postedblogs = res.blogs;
    })
    this.imageUrl = null;
    this.coverUrl = null;
    this.restId = this.authService.getUserId()

    this.dataForm = this.formBuilder.group({
      title: ['', Validators.required],
      blog: ['', Validators.required],
      thumbnail: [null],
      cover_image: [null],
    });
    this.imageURL = environment.apiUrl
  }
  openAddEditBlog(content) {
    this.modalService.open(content, { size: "lg", windowClass: 'custom-delete-modal-class' });
  }




  get f() { return this.dataForm.controls; }

  onSubmits() {
    this.submitted = true;
    if (this.dataForm.invalid) {

      return;
    }
    this.loading = true;
    let params = this.makeParam();
    this.adminService.uploadBlog(params).subscribe(res => {

      if (res.status == 200) {
        this.f.blog.setValue('');
        this.f.title.setValue('');
        this.submitted = false;
        this.loading = false;

        this.imageUrl = null;
        this.coverUrl = null;
        this.addNew = false;
        this.modalService.dismissAll();
        this.toastrService.success('Successed', 'add new blog');

        setTimeout(() => {
          this.adminService.getBlogsByUserId({
            "pageIndex": 1,
            "pageSize": 10
          }).subscribe((res) => {
            this.postedblogs = res.blogs;
          })
        }, 1000);

      }
      else {
        this.toastrService.error('Server Error', 'error');

        this.errorMessege = res.message

      }
    })
    this.featuredBlog = false
  }
  onSubmit() {
    this.submitted = true;
    this.errorMessege = null
    // if (this.dataForm.invalid) {
    //   return;
    // }
    this.loading = true;
    let params = this.makeParam();

    this.http.post<any>(`${environment.apiUrl}/admin/v0/blog`, params)
      .subscribe(
        (res) => {

          this.f.blog.setValue('');
          this.f.title.setValue('');
          this.submitted = false;
          this.loading = false;
          this.imageUrl = null;
          this.coverUrl = null;
          this.addNew = false;
          this.adminService.getBlogsByUserId({
            "pageIndex": 1,
            "pageSize": 10
          }).subscribe((response) => {
            this.postedblogs = response.blogs;
          })
          this.toastrService.success('Successed', 'updated');
          this.modalService.dismissAll();


        },
        error => {
          this.errorMessege = error.error.message
          // this.toastrService.error('error', 'server error');
          this.loading = false;


        })
    this.featuredBlog = false

  }


  cancelBtn() {
    this.addNew = false;
    this.errorMessege = null

    this.isEdit = false;
    this.modalService.dismissAll();
    this.loading = false;

    this.imageUrl = null;
    this.coverUrl = null;

    this.dataForm = this.formBuilder.group({
      title: ['', Validators.required],
      blog: ['', Validators.required],
      thumbnail: [null],
      cover_image: [null],
    });
  }


  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const image = new Image();

        image.src = reader.result as string;
        image.onload = () => {
          const canvas = this.canvasRef.nativeElement;

          const context = canvas.getContext('2d');
          const maxWidth = 1024;
          const maxHeight = 1024;
          let width = image.width;
          let height = image.height;

          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;
          context.drawImage(image, 0, 0, width, height);
          this.imageUrl = canvas.toDataURL('image/jpeg');
          this.dataForm.patchValue({
            thumbnail: file,
          });
          this.dataForm.get('thumbnail').updateValueAndValidity();
        };
      };
    }
  }
  uploadCover(event) {

    const filess = (event.target as HTMLInputElement).files[0];
    if (filess) {
      const reader = new FileReader();
      reader.readAsDataURL(filess);

      reader.onload = () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = () => {
          const canvasCover = this.canvasCoverRef.nativeElement;
          const context = canvasCover.getContext('2d');
          const maxWidth = 800;
          const maxHeight = 400;
          let width = image.width;
          let height = image.height;
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
          canvasCover.width = width;
          canvasCover.height = height;
          context.drawImage(image, 0, 0, width, height);
          this.coverUrl = canvasCover.toDataURL('image/jpeg');
          this.dataForm.patchValue({
            cover_image: filess,
          });
          this.dataForm.get('thumbnail').updateValueAndValidity();
        };
      };
    }
  }

  changeFeatureBlog(e) {
    const status = e.checked
    if (status === true) {
      this.featuredBlog = true
    } else {
      this.featuredBlog = false
    }
  }
  onEdit(item: any) {
    this.submitted = false;
    this.isEdit = true;
    this.addNew = false;
    this.editItem = item;
    if (this.editItem.featured === 1) {
      this.featuredBlog = true
    }
    else {
      this.featuredBlog = false
    }
    this.editItem.featured = this.editItem.featured
    this.id = this.editItem.id
    this.dataForm = this.formBuilder.group({
      title: [this.editItem.title, Validators.required],
      blog: [this.editItem.content, Validators.required],
      featuredBlog: [this.featuredBlog, Validators.required],
      thumbnail: [this.editItem.thumbnail, Validators.required],
      cover_image: [this.editItem.cover_image, Validators.required],
    });
    this.imageUrl = this.imageURL + '/' + this.editItem.thumbnail;
    this.coverUrl = this.imageURL + '/' + this.editItem.cover_image;




  }


  onDelete(blogid: any) {
    this.adminService.deleteBlog(blogid).subscribe(res => {
      if (res.status == 204) {
        setTimeout(() => {
          this.adminService.getBlogsByUserId({
            "pageIndex": 1,
            "pageSize": 10
          }).subscribe((response) => {
            this.postedblogs = response.blogs;
          })
        }, 1000);
      }
    })
  }
  // onEditBlogw() {
  //   this.submitted = true;
  //   this.loading = true;
  //   let params = this.makeParam();
  //     this.adminService.updateBlog(params ,this.id).subscribe(res => {
  //     if (res.status == 200) {
  //       this.f.blog.setValue('');
  //       this.f.title.setValue('');
  //       this.submitted = false;
  //       this.loading = false;
  //       this.addNew = false;
  //       this.isEdit = false;
  //       this.imageUrl = null;
  //       this.coverUrl = null;
  //       this.coverUrl = null;
  //       this.toastrService.success('Successed', 'updated');

  //       this.modalService.dismissAll();

  //       setTimeout(() => {
  //         this.adminService.getBlogsByUserId({
  //           "pageIndex": 1,
  //           "pageSize": 10
  //         }).then((response) => {
  //           this.postedblogs = response.blogs;
  //         })
  //       }, 1000);
  //     }
  //     else if(res.status == 400){
  //       this.toastrService.error('error', 'server error');

  //     }
  //   })
  //   this.featuredBlog = false

  // }
  onEditBlog() {
    this.submitted = true;
    this.loading = true;
    this.errorMessege = null

    let params = this.makeParam();
    this.http.put<any>(`${environment.apiUrl}/admin/v0/updateBlogById/${this.id}`, params)
      .subscribe(
        (res) => {
          this.f.blog.setValue('');
          this.f.title.setValue('');
          this.submitted = false;
          this.loading = false;
          this.addNew = false;
          this.isEdit = false;
          this.imageUrl = null;
          this.coverUrl = null;
          this.coverUrl = null;
          this.adminService.getBlogsByUserId({
            "pageIndex": 1,
            "pageSize": 10
          }).subscribe((response) => {
            this.postedblogs = response.blogs;
          })
          this.toastrService.success('Successed', 'updated');
          this.modalService.dismissAll();


        },
        error => {
          this.toastrService.error('error', 'server error');

        })
    this.featuredBlog = false

  }


  handlePageEvent(event) {
    // this.params.approve_pageIndex = event.pageIndex;
    // this.params.approve_pageSize = event.pageSize;
    // this.getDataFromServer()
  }
  makeParam() {
    var formData: any = new FormData();
    formData.append("id", this.isEdit ? this.id : '');
    formData.append("title", this.f.title.value);
    formData.append("rest_owner_id", this.restId);
    formData.append("content", this.f.blog.value);
    formData.append("thumbnail", this.dataForm.value.thumbnail);
    formData.append("cover_image", this.dataForm.value.cover_image);
    formData.append("featured_blog", this.featuredBlog);
    return formData;
  }

}
