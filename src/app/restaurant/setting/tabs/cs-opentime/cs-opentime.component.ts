import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { AmazingTimePickerService } from '@jonijnm/amazing-time-picker';
import { DayPilot, DayPilotNavigatorComponent, DayPilotMonthComponent } from "daypilot-pro-angular";
import { RestaurantService, AuthService } from '../../../../_services';
import { SettingChangeEvent } from '../../../../_models/restaurant/SettingChangeEvent';

import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { CookieService } from 'ngx-cookie-service';

// import { CalendarOptions } from '@fullcalendar/angular';
@Component({
  selector: 'app-cs-opentime',
  templateUrl: './cs-opentime.component.html',
  styleUrls: ['./cs-opentime.component.scss']
})
export class CsOpentimeComponent implements OnInit {


  @ViewChild("month") month: DayPilotMonthComponent;
  @ViewChild("navigator") nav: DayPilotNavigatorComponent;

  @Input() timeinfo: any;
  @Output() onUpdate = new EventEmitter<SettingChangeEvent>();

  open_time: any = '';
  close_time: any = '';

  constructor(
    private atp: AmazingTimePickerService, // this line you need
    private restService: RestaurantService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private cookieService : CookieService,
  ) { }

  date = DayPilot.Date.today();

  configNavigator: DayPilot.NavigatorConfig = {
    showMonths: 1,
    cellWidth: 25,
    cellHeight: 25,
    onVisibleRangeChanged: (args) => {
      let from = this.nav.control.visibleStart().addDays(7);
      this.configMonth.startDate = from;
    }
  };


  configMonth: DayPilot.MonthConfig = {
    startDate: this.date,
    visible: true,
    eventMoveHandling: 'Disabled',
    eventResizeHandling: 'Disabled',
    eventDeleteHandling: 'Disabled',
    onTimeRangeSelected: (args) => {
     this.breakDateUpdate(args.start);
    },
    onBeforeCellRender: (args) => {
      if(this.breaksdates) {
        for (let d of this.breaksdates) {
          var _d = new Date(d)
          if (args.cell.start.getTime() === _d.getTime()) {
            args.cell.backColor = "#ac0";
          }
        }
      }
    }
  };

  breaksdates: any[]=[];

  ngOnInit(): void {
    this.open_time = this.timeinfo.open_time;
    this.close_time = this.timeinfo.close_time;
    this.breaksdates = JSON.parse(this.timeinfo.block_date);
  }


  changeDate(date: DayPilot.Date): void {
    
    this.configMonth.startDate = date;
    this.breakDateUpdate(date);
  }

  breakDateUpdate(date){
    var _d = this.convertYMD(date);

    if (this.breaksdates.indexOf(_d) < 0) {
      this.breaksdates.push(_d);
    } else {
      this.breaksdates = this.breaksdates.filter((d) => {
        if (d != _d) return d;
      })
    }

    this.month.control.update();
  }

  convertYMD(_date) {
    var date = new Date(_date);
    var _y = date.getFullYear();
    var _m = date.getMonth() + 1;
    var _d = date.getDate();
    var m, d;
    m = _m < 10 ? '0' + _m : _m;
    d = _d < 10 ? '0' + _d : _d;
    return _y + '-' + m + '-' + d;
  }

  openTime() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.open_time = time;
    });
  }

  closeTime() {
    const amazingTimePicker = this.atp.open();
    amazingTimePicker.afterClose().subscribe(time => {
      this.close_time = time;
    });
  }

  save(){
    if(this.open_time == '' || this.close_time == '') {
      Swal.fire({
        title: 'Check Again',
        text: 'No available Open Time or Close Time',
        icon: 'error',
      })
      return;
    }
    Swal.fire({
      title: 'Please Confirm Again',
      text: 'This will update open time, close time, and breaks days',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonText: 'OK',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        
        var parms = {
          rest_id: this.cookieService.get('default_rest_id'),
          open_time: this.open_time,
          close_time: this.close_time,
          block_date: JSON.stringify(this.breaksdates)
        }
        this.restService.updateDateTimeInfo(parms).subscribe(a => {
          this.toastrService.success("Time Info Updated Successfully", 'Success');
          var event = new SettingChangeEvent();
          event.tabid = 5;
          this.onUpdate.emit(event);
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

}
