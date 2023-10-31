import { Component, Input, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private toastrService: ToastrService,
  ) { }

  getPackageList: any;
  isLoading: Boolean = false;
  PackageID: any;
  IsEdit: Boolean = false;
  IsAdd: Boolean = false;
  loading: Boolean = false;
  length = null;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  descriptionss:any;
  formData = {
    sequence : '',
    title: '',
    product_id: '',
    status: false,
    features: [] ,
    nofeatures: [] ,
    description  : '',
    prices:[],


  };
  access_list: number[] = [];
  MyAccess : number[]= [];

  AccessList:any;
  summernoteConfig: any;



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
    this.getAllPackages();
    this.getAllAccessList();
  }
  
  receiveSelectedNodeIds(selectedNodeIds: number[]) {
    this.access_list = selectedNodeIds; // Child component se aane wale selectedNodeIds array ko accesslist mein set karen

  }
 

  getAllPackages() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/admin/v0/packages?&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(
        (res) => {
          this.getPackageList = res.data;
          this.length = res.count;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }
  getAllAccessList() {
    this.loading = true;
 
      this.http.get<any>(`${environment.apiUrl}/admin/v0/accessLists`)
      .subscribe(
        (res) => {
          this.AccessList = res.data;
        },
    
      );
  }
  addPrices(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.formData.prices.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }
  removePrices(keyword: string): void {
    const index = this.formData.prices.indexOf(keyword);

    if (index >= 0) {
      this.formData.prices.splice(index, 1);
    }
  }
  addFeatureOrNoFeature(event: MatChipInputEvent, featureType: 'features' | 'nofeatures'): void {
    const input = event.input;
    const value = event.value;
  
    if ((value || '').trim()) {
      this.formData[featureType].push(value.trim());
    }
  
    if (input) {
      input.value = '';
    }
  }
  
  removeFeatureOrNoFeature(feature: string, featureType: 'features' | 'nofeatures'): void {
    const index = this.formData[featureType].indexOf(feature);
  
    if (index >= 0) {
      this.formData[featureType].splice(index, 1);
    }
  }
// Function to handle key up events for adding features or nofeatures
onKeyUp(event: KeyboardEvent, featureType: 'features' | 'nofeatures'): void {
  // Remove the check for 'Enter' key press
  // this.addFeatureOrNoFeature(event, featureType);
}
  createPackage() {
    const featuresString = JSON.stringify(this.formData.features);
    const NofeaturesString = JSON.stringify(this.formData.nofeatures);
    const PricesString = JSON.stringify(this.formData.prices);
    const PricesAccessList = JSON.stringify(this.access_list);



    let body = new URLSearchParams();
    body.set('sequence', this.formData.sequence);
    body.set('description', this.formData.description);
    body.set('access_list', PricesAccessList);
    body.set('title', this.formData.title);
    body.set('prices', PricesString);
    body.set('product_id', this.formData.product_id);
    body.set('status', this.formData.status ? 'true' : 'false');
    body.set('features', featuresString); 
    body.set('features_not_include', NofeaturesString); 



    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.http
      .post(`${environment.apiUrl}/admin/v0/package`, body.toString(), options)
      .subscribe(response => {
        this.IsAdd = false;
        this.modalService.dismissAll();
        this.toastrService.success('Success', 'Successfully Added Package');
        this.getAllPackages();
        this.formData = {
          sequence : '',
          title: '',
          prices: [],
          product_id: '',
          status: false,
          features: [] ,
          nofeatures: [] ,
          description  : '',
      
      
        };
        this.access_list = []
      },
        (error) => {
          console.error('Error:', error);
        });
  }
  parseValue(data: string): string[] {
    try {
      const dataArray = JSON.parse(data);
      if (Array.isArray(dataArray)) {
        return dataArray;
      }
    } catch (error) {
      console.error('Error parsing data:', error);
    }
    return [];
  }
  openScreen(content) {
    this.MyAccess = this.access_list

    this.IsAdd = true;
    this.IsEdit = false;
    this.modalService.open(content, { size: "lg", windowClass: 'custom-delete-modal-class' });
  }

  openEditModal(content, item) {

    this.IsEdit = true;
    this.IsAdd = false;

    this.modalService.open(content, { size: "lg", windowClass: 'custom-delete-modal-class' });
    this.access_list = item.access_list;
    this.formData.title = item.title;
    this.formData.prices = item.prices;
    this.formData.product_id = item.product_id;
    this.formData.sequence = item.sequence;
    this.formData.description = item.description;
    this.formData.status = item.status; // Update the subscreen checkbox here
    this.formData.features = item.features;
    this.formData.nofeatures = item.features_not_include;
    this.PackageID = item.id;
    this.MyAccess = this.access_list
  }

  openDeleteModal(content, id) {
    this.modalService.open(content, { size: "md", windowClass: 'custom-delete-modal-class' });
    this.PackageID = id;
  }

  openDeleteScreen() {
    const apiEndpoint = `${environment.apiUrl}/admin/v0/package?id=${this.PackageID}`;
    this.http
      .delete(apiEndpoint)
      .subscribe(
        (response) => {
          this.getAllPackages();
          this.modalService.dismissAll();
          this.toastrService.success('Success', 'Successfully deleted');
        },
        (error) => {
          this.toastrService.error('Server Error', 'Error');
        }
      );
  }

  EditScreen() {
  
   const featuresString = JSON.stringify(this.formData.features);
    const NofeaturesString = JSON.stringify(this.formData.nofeatures);
    const PricesString = JSON.stringify(this.formData.prices);
    const PricesAccessList = JSON.stringify(this.access_list);



    let body = new URLSearchParams();
    body.set('sequence', this.formData.sequence);
    body.set('description', this.formData.description);
    body.set('access_list', PricesAccessList);
    body.set('title', this.formData.title);
    body.set('prices', PricesString);
    body.set('product_id', this.formData.product_id);
    body.set('status', this.formData.status ? 'true' : 'false');
    body.set('features', featuresString); 
    body.set('features_not_include', NofeaturesString); 
    let options = {
      headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };

    this.http.put(`${environment.apiUrl}/admin/v0/package?id=${this.PackageID}`, body.toString(), options)
      .subscribe(response => {
        this.IsEdit = false;
        this.modalService.dismissAll();
        this.toastrService.success('Success', 'Successfully Edit Package');
        this.getAllPackages();
        this.formData = {
          sequence : '',
          title: '',
          prices: [],
          product_id: '',
          status: false,
          features: [] ,
          nofeatures: [] ,
          description  : '',
      
      
        };
        this.access_list= [];

      },
        (error) => {
        });
  }

  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getAllPackages();
  }
}


