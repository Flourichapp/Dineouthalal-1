import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';
import { MatChipInputEvent } from '@angular/material/chips';


@Component({
  selector: 'app-meta-tags',
  templateUrl: './meta-tags.component.html',
  styleUrls: ['./meta-tags.component.scss']
})
export class MetaTagsComponent implements OnInit {

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
    private toastrService: ToastrService,

  ) { }
  total: any;
  selectedMetaIndex: number; // To track the index of the selected item for editing
  keywordString: string = '';
  keywords: string[] = [];
  isLoading: false;
  MetaId: any;
  isAdd : boolean = false;  isEdit : boolean = false

  params = {
    all_pageIndex:0,
    all_pageSize:10,
  }
  metaTags : any;
  formData = {
    title: '',
    meta: {
      description: '',
      url: '',
      image: '',
      type: '',
      keywords:[]
    },
    routename: '',
    
  };
  ngOnInit(): void {
    this.getMetaTags()
    
  }

  separatorKeysCodes: number[] = [13, 188]; // Enter and comma key codes

  addKeyword(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    if ((value || '').trim()) {
      this.formData.meta.keywords.push(value.trim());
    }

    if (input) {
      input.value = '';
    }
  }
  removeKeyword(keyword: string): void {
    const index = this.formData.meta.keywords.indexOf(keyword);

    if (index >= 0) {
      this.formData.meta.keywords.splice(index, 1);
    }
  }
  cancelBtn() {
    this.isAdd = false;
    this.isEdit = false;
    this.modalService.dismissAll();
    this.formData = {
      title: '',
      meta: {
        description: '',
        url: '',
        image: '',
        type: '',
        keywords:[]
  
      },
      routename: '',
    };
  }
 
  openAddMeta(content) {
    this.isAdd = true;
    this.isEdit = false;
    this.modalService.open(content, { size: "lg", windowClass: 'custom-delete-modal-class' });
  }
  openEditModal(content, index) {
    this.isEdit = true;
    this.isAdd = false;
    this.modalService.open(content, { size: "lg", windowClass: 'custom-delete-modal-class' });
    this.selectedMetaIndex = index;
    const selectedMeta = this.metaTags[this.selectedMetaIndex];
    this.formData.title = selectedMeta.title;
    this.formData.meta.description = this.parseMeta(selectedMeta.meta).description;
    this.formData.meta.image = this.parseMeta(selectedMeta.meta).image;
    this.formData.meta.type = this.parseMeta(selectedMeta.meta).type;
    this.formData.meta.url = this.parseMeta(selectedMeta.meta).url;
    this.formData.meta.keywords = this.parseMeta(selectedMeta.meta).keywords;
    this.formData.routename = selectedMeta.route_name;
  }
  AddMetaTags() {
    const apiEndpoint = `${environment.apiUrl}/admin/v0/meta`;
    this.http
      .post(apiEndpoint, this.formData)
      .subscribe(
        (response) => {
          this.modalService.dismissAll();
          this.toastrService.success('Successed', 'Successfully Add Meta Tags and Keywords');
          this.getMetaTags()
          this.formData = {
            title: '',
            meta: {
              description: '',
              url: '',
              image: '',
              type: '',

              keywords:[]
        
            },
            routename: '',
          };
        },
        (error) => {
          this.toastrService.error('Server Error', 'error');

        }
      );
  }

  handlePageEvent(event){
    this.params.all_pageIndex = event.pageIndex;
    this.params.all_pageSize = event.pageSize;
    this.getMetaTags()
  }
  parseMeta(meta: string): { description: string; keyword: string ,url :string , image: string,type: string,keywords } {
    const metaObj = JSON.parse(meta);
    return {
      description: metaObj.description,
      keyword: metaObj.keyword,
      url: metaObj.url,
      image: metaObj.image,
      type: metaObj.type,
      keywords : metaObj.keywords

    };
  }
  getMetaTags() {
    const apiEndpoint = `${environment.apiUrl}/admin/v0/meta?all_pageIndex=${this.params.all_pageIndex}&all_pageSize=${this.params.all_pageSize}`;
    this.http
      .get(apiEndpoint)
      .subscribe(
        (response) => {
        this.metaTags = response['data']
        this.total = response['count']
        },
        (error) => {
          console.error('Error:', error);
        }
      );
  }
  openDeleteModal(content,id) {
    this.modalService.open(content, { centered: true });
    this.MetaId = id;
    
  }
  deleteMetaTags() {
    const apiEndpoint = `${environment.apiUrl}/admin/v0/meta/${this.MetaId}`;
    this.http
      .delete(apiEndpoint)
      .subscribe(
        (response) => {
          this.modalService.dismissAll();
          this.getMetaTags()
          this.toastrService.success('Successed', 'Successfully deleted');

        },
        (error) => {
          this.toastrService.error('Server Error', 'error');

        }
      );
  }

  updateMetaTags() {
    const selectedMeta = this.metaTags[this.selectedMetaIndex];
    const apiEndpoint = `${environment.apiUrl}/admin/v0/meta/${selectedMeta.id}`;
    this.http
      .put(apiEndpoint, this.formData)
      .subscribe(
        (response) => {
          this.modalService.dismissAll();
          this.toastrService.success('Success', 'Successfully updated Meta Tags and Keywords');
          this.getMetaTags();
          this.formData = {
            title: '',
            meta: {
              description: '',
              url: '',
              image: '',
              type: '',
              keywords:[]
        
            },
            routename: '',
          };
        },
        (error) => {
          this.toastrService.error('Server Error', 'Error updating Meta Tags and Keywords');
        }
      );
  }
}




