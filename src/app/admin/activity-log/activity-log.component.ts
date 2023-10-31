import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit {

  constructor(    
    private http:HttpClient,
    private route: ActivatedRoute
    ) { }
    AllActivity: any;
    loading: Boolean = false;
    isSearchPerformed: Boolean = false
    length = null;
    pageIndex= 0;
    pageSize = 10;
    pageSizeOptions: number[] = [5, 10, 25, 100];
    filteredActivity: any;
    searchText: string = '';
   
  ngOnInit(): void {
 

    this.getAllActivity()
  }
  getAllActivity() {
    this.loading = true;
    this.http.get<any>(`${environment.apiUrl}/v1/getActivityLog?&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(
        (res) => {
          this.AllActivity = res.rows;
          if (!this.isSearchPerformed) { // Condition added
            this.filteredActivity = res.rows;
          }
          this.length = res.total;
          this.loading = false;
        },
        error => {
          this.loading = false;
        }
      );
  }

  search() {
    this.loading = true;
    const searchParam = this.searchText.trim();
    this.http.get<any>(`${environment.apiUrl}/v1/getActivitySearch?search=${searchParam}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}`)
      .subscribe(
        (res) => {
          this.filteredActivity = res.rows;
          this.length = res.total;
          this.loading = false;
          this.isSearchPerformed = true; // Setting the flag to true
        },
        error => {
          this.loading = false;
        }
      );
  }

  reset() {
    this.searchText = '';
    this.isSearchPerformed = false; // Resetting the flag
    this.getAllActivity();
  }

  changePage(e) {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    if (this.isSearchPerformed) {
      this.search();
    } else {
      this.getAllActivity();
    }
  }
}





