import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
interface TreeNode {
  id: number;
  screen_name: string;
  subscreen: boolean;
  parent_screen: string;
  isChecked?: boolean;
}
@Component({
  selector: 'app-access-list',
  templateUrl: './access-list.component.html',
  styleUrls: ['./access-list.component.scss']
})
export class AccessListComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private toastrService: ToastrService,
  ) { }

  AllAccessList: any;
  isLoading: Boolean = false
  AccessListId : any;
  IsEdit: Boolean = false;
  IsAdd : Boolean = false;
  loading: Boolean = false;
  length = null;
  pageIndex = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];
  formData = {
    screen_name: '',
    url: '',
    subscreen: false,
    parent_screen: ''
  };
  selectedScreenName = '';
  filteredScreenNames = [];
  dropdownVisible: Boolean = false;
  AccessList:any


 
  ngOnInit(): void {


    this.getAllAccessList()
  }
  getAllAccessList() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/admin/v0/accessLists?&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(
        (res) => {
          this.AllAccessList = res.data;

          this.length = res.count;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
      this.http.get<any>(`${environment.apiUrl}/admin/v0/accessLists`)
      .subscribe(
        (res) => {
          this.AccessList = res.data;
        },
    
      );
  }

  filterScreenNames() {
    this.filteredScreenNames = this.AccessList.filter(screen =>
      screen.screen_name.toLowerCase().includes(this.selectedScreenName.toLowerCase())
    );

    this.dropdownVisible = this.filteredScreenNames.length > 0; // Toggle visibility
  }

  selectScreen(screen) {
    this.selectedScreenName = screen.screen_name;
    this.formData.parent_screen = screen.id;

    this.dropdownVisible = false; // Close dropdown after selection
  }
  showDropdown() {
    this.filteredScreenNames.length > 0 ? this.dropdownVisible = true : this.dropdownVisible = false;
  }
  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible; // Toggle dropdown visibility
  }
  hideDropdown() {
    this.dropdownVisible = false;
  }
  createScreen() {
    let body = new URLSearchParams();
    body.set('screen_name', this.formData.screen_name);;
    body.set('url', this.formData.url);
    body.set('subscreen', this.formData.subscreen ? 'true' : 'false');
    const subscreenEnabled = true; 
    if (subscreenEnabled) {
      body.set('parent_screen', this.formData.parent_screen );
    } else {
      body.set('parent_screen', ''); 
    }

    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    this.http
        .post(`${environment.apiUrl}/admin/v0/accessList`, body.toString(), options)
        .subscribe(response => {
          this.IsAdd = false;
          this.modalService.dismissAll();
          this.toastrService.success('Successed', 'Successfully Add Screen');
          this.getAllAccessList()
          this.formData = {
            screen_name: '',
            url: '',
            subscreen: false,
            parent_screen: ''
          };      
          this.filteredScreenNames = [];

         },
        (error) => {
          console.error('Error:', error);
        });

   
  }
  openScreen(content) {
    this.IsAdd = true;
    this.IsEdit= false;
    this.modalService.open(content, { size: "md", windowClass: 'custom-delete-modal-class' });
  }
  openEditModal(content, item){
    this.IsEdit = true;
    this.IsAdd = false;

    this.modalService.open(content, { size: "md", windowClass: 'custom-delete-modal-class' });
    this.formData.screen_name = item.screen_name;
    this.formData.parent_screen = item.parent_screen;
    this.formData.url = item.url;
    this.formData.subscreen = item.subscreen; // Update the subscreen checkbox here
    this.AccessListId = item.id;


  }
  openDeleteModal(content , id){
    this.modalService.open(content, { size: "md", windowClass: 'custom-delete-modal-class' });
    this.AccessListId = id

  }
 
  openDeleteScreen() {
    const apiEndpoint = `${environment.apiUrl}/admin/v0/accessList?id=${this.AccessListId}`;
    this.http
      .delete(apiEndpoint)
      .subscribe(
        (response) => {
          this.getAllAccessList()

          this.modalService.dismissAll();
          this.toastrService.success('Successed', 'Successfully deleted');

        },
        (error) => {
          this.toastrService.error('Server Error', 'error');

        }
      );
  }
  EditScreen() {
    let body = new URLSearchParams();
    body.set('screen_name', this.formData.screen_name);;
    body.set('url', this.formData.url);
    body.set('subscreen', this.formData.subscreen ? 'true' : 'false');
    const subscreenEnabled = true; 
    if (subscreenEnabled) {
      body.set('parent_screen', this.formData.parent_screen );
    } else {
      body.set('parent_screen', ''); 
    }

    let options = {
        headers: new HttpHeaders().set('Content-Type', 'application/x-www-form-urlencoded')
    };
    
    this.http
        .put(`${environment.apiUrl}/admin/v0/accessList?id=${this.AccessListId}`, body.toString(), options)
        .subscribe(response => {
          this.IsEdit = false;
          
          this.modalService.dismissAll();
          this.toastrService.success('Successed', 'Successfully Edit Screen');
          this.getAllAccessList()
          this.formData = {
            screen_name: '',
            url: '',
            subscreen: false,
            parent_screen: ''
          };      
          this.filteredScreenNames = [];

         },
        (error) => {
          console.error('Error:', error);
        });

   
  }


  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.getAllAccessList();
  }
}




