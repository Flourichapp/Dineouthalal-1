import { Component, OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label, Colors } from 'ng2-charts';
import { AdminService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
@Injectable({ providedIn: 'root' })
export class DashboardComponent implements OnInit {
  toggleProBanner(event) {
    event.preventDefault();
    document.querySelector('body').classList.toggle('removeProbanner');
  }
  constructor(
    private adminService: AdminService
  ) { }
  imageURL : any

  need_approving: any = 0;
  total_rests: any = 0;
  total_finances: any = 0;
  total_approving: [];

  areaChartLabels = ["2013", "2014", "2014", "2015", "2016", "2017"];

  areaChartOptions = {
    // scales: {
    //   yAxes: [{
    //     ticks: {
    //       beginAtZero: true
    //     }
    //   }]
    // },
    // legend: {
    //   display: true
    // },
    // elements: {
    //   point: {
    //     radius: 0
    //   }
    // }
  };

  areaChartColors = [
    {
      borderColor: 'rgba(255,99,132,1)',
      backgroundColor: 'rgba(255,99,132,.2)'
    }
  ];

  areaChartData = [{
    label: 'Creators',
    data: [10, 19, 3, 5, 2, 3],
    borderWidth: 1,
    fill: true
  }];


  yearly_earning = [];
  monthly_earning = [];
  daily_earning = [];

  yearly_label = [];
  monthly_label = [];
  daily_label = [];



  ngOnInit() {
    this.getChartLabels();
    this.adminService.getDashboardData().subscribe(res => {

      this.yearly_earning = this.getChartValue(this.yearly_label, res.data.yearly_earning);
      this.monthly_earning = this.getChartValue(this.monthly_label, res.data.monthly_earning);
      this.daily_earning = this.getChartValue(this.daily_label, res.data.daily_earning);

      this.areaChartLabels = this.daily_label;
      this.areaChartData = [{
        label: 'Daily Earning',
        data: this.daily_earning,
        borderWidth: 1,
        fill: true
      }];

      this.total_approving = res.data.approving_total;
      this.total_rests = res.data.all_total;
      this.total_finances = res.data.finace;
      this.need_approving = res.data.approving;

    })
    this.imageURL = environment.apiUrl


  }

  getChartValue(flag, value) {
    var result = [];
    flag.forEach((item)=>{
      var y_e = value.filter((y) =>{
        if(y.paid_at == item) return y;
      });
      if(y_e.length > 0) {
        result.push(parseInt(y_e[0].amount));
      } else {
        result.push(0);
      }
    })
    return result;
  }

  getChartLabels() {
    var today = new Date();
    var year = today.getFullYear();
    for (var i = 2; i >= 0; i--) {
      this.yearly_label.push(JSON.stringify(year - i));
    }

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    for (var i = 6; i >= 0; i--) {
      var firstdayofmonth = new Date(today.getFullYear(), today.getMonth() - i, 1);
      var m = firstdayofmonth.getMonth() + 1;
      var y = firstdayofmonth.getFullYear();
      this.monthly_label.push(y + '-' + (m < 10 ? '0' + m : m));
    }

    for (var i = 13; i >= 0; i--) {
      var d = new Date();
      d.setDate(d.getDate() - i);
      var m = d.getMonth() + 1;
      var y = d.getFullYear();
      var dd = d.getDate();
      this.daily_label.push(y + '-' + (m < 10 ? '0' + m : m) + '-' + (dd < 10 ? '0' + dd : dd))
    }

  }

  selectDisplayFlag(event) {
    switch (event.value) {
      case 'daily':
        this.areaChartLabels = this.daily_label;
        this.areaChartData = [{
          label: 'Daily Earning',
          data: this.daily_earning,
          borderWidth: 1,
          fill: true
        }];
        this.areaChartColors = [
          {
            borderColor: 'rgba(255,99,0,1)',
            backgroundColor: 'rgba(255,99,0,.2)'
          }
        ];
        break;
      case 'monthly':
        this.areaChartLabels = this.monthly_label;
        this.areaChartData = [{
          label: 'Monthly Earning',
          data: this.monthly_earning,
          borderWidth: 1,
          fill: true
        }];        
        this.areaChartColors = [
          {
            borderColor: 'rgba(0,99,132,1)',
            backgroundColor: 'rgba(0,99,132,.2)'
          }
        ];
        break;
      case 'yearly':
        this.areaChartLabels = this.yearly_label;
        this.areaChartData = [{
          label: 'Yearly Earning',
          data: this.yearly_earning,
          borderWidth: 1,
          fill: true
        }];               
        this.areaChartColors = [
          {
            borderColor: 'rgba(0,0,132,1)',
            backgroundColor: 'rgba(0,0,132,.2)'
          }
        ];
        break;    
      default:
        break;
    }
  }

}
