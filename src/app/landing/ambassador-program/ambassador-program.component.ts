import { Component, OnInit } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { HomeService } from '../../_services';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-ambassador-program',
  templateUrl: './ambassador-program.component.html',
  styleUrls: ['./ambassador-program.component.scss']
})
export class AmbassadorProgramComponent implements OnInit {

  constructor(
    private metaTagService: Meta,
    private homeService: HomeService,
    private location: Location,
    private http: HttpClient,
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,

  ) { }
  dataForm: FormGroup;

  currentPath: string;
  fileName: any;

  name: any;
  email: any;
  socialurl: any;
  description: any;
  disableButton: boolean; true;
  selectedFile: File | null = null; // Variable to store the selected file

  ngOnInit(): void {
  document.getElementById("myDIV").scrollTop = 0;

    this.currentPath = this.location.path();
    this.homeService.getMetaDataByRouteName(this.currentPath)

    this.dataForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      socialurl: ['', Validators.required],
      description: ['', Validators.required],
      file: [null],
    });


  }
  get d() { return this.dataForm.controls; }

  onSubmit() {
    let params = this.makeParam();
    this.http.post<any>(`${environment.apiUrl}/v2/ambassador`, params).subscribe(
      response => {
        this.toastrService.success('Success', 'Request successfully sent');
        this.dataForm.reset(); // Reset the form after successful submission
        this.fileName = ''
        // Handle the response here
      },
      error => {
        this.toastrService.error('Server Error', 'error');
        // Handle the error here
      }
    );
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.fileName = file.name
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {

      };
    }
    this.dataForm.patchValue({
      file: file
    });

    this.dataForm.get('file').updateValueAndValidity()
  }
  makeParam() {
    var formData: any = new FormData();
    formData.append("name", this.name);
    formData.append("email", this.name);
    formData.append("description", this.description);
    formData.append("socialurl", this.socialurl);

    formData.append("file", this.dataForm.value.file);

    return formData;
  }
}
