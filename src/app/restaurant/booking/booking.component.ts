import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { DayPilot, DayPilotNavigatorComponent, DayPilotSchedulerComponent } from "daypilot-pro-angular";
import Swal from 'sweetalert2';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService, RestaurantService } from '../../_services';
import { env } from '../../config';
import { ToastrService } from 'ngx-toastr';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
 import { DatePipe } from '@angular/common';
 import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  @ViewChild('scheduler', { static: false }) scheduler: DayPilotSchedulerComponent;
  @ViewChild("navigator") navigator: DayPilotNavigatorComponent;
  @ViewChild("gallaryModal") gallaryModalref: NgbModalRef;

  seats: any[] = [
    { name: 'All', value: 0 },
    { name: '2+ seats', value: 2 },
    { name: '3+ seats', value: 3 },
    { name: '4+ seats', value: 4 },
    { name: '5+ seats', value: 5 },
    { name: '6 seats', value: 6 },
  ];
  restId = this.cookieService.get('default_rest_id');

  approvedColor: any = '#5b59ff';
  pendingColor: any = '#ef7b7b';
  closedColor: any = 'gray';
  confirmBooking: any;
  formatdate: any;
  isLoading : boolean = false;

  navigatorConfig: DayPilot.NavigatorConfig = {
    showMonths: 1,
    skipMonths: 1,
    selectMode: "Day",
    // selectMode: "Week",
    startDate: DayPilot.Date.today().firstDayOfMonth(),
    cellWidth: 25,
    cellHeight: 25,
    dayHeaderHeight: 30,
    titleHeight: 30
  };

  seatFilter = 0;

  timeFilter: { start: DayPilot.Date, end: DayPilot.Date } = null;

  //config scheduler

  config: any = {
    eventHeight: 40,
    cellWidthSpec: 'Fixed',
    cellWidth: 50,
    timeHeaders: [{ groupBy: 'Day', format: 'dddd, d MMMM yyyy' }, { groupBy: 'Hour' }, { groupBy: 'Cell', format: 'mm' }],
    scale: 'CellDuration',
    cellDuration: 30,
    days: 1,
    startDate: DayPilot.Date.today(),//.firstDayOfWeek(),
    timeRangeSelectedHandling: 'Enabled',
    treeEnabled: true,
    heightSpec: "Max",//"Auto",// | "Max" | "Fixed" | "Parent100Pct" | "Max100Pct";
    // height: 400,
    rowHeaderColumns: [
      { title: 'Table', display: 'name' },
      { title: 'Seats' }
    ],
    eventMoveHandling: 'Disabled',
    eventResizeHandling: 'Disabled',
    eventDeleteHandling: 'Disabled',
    businessBeginsHour: 0,
    businessEndsHour: 24,
    businessWeekends: true,
    showNonBusiness: false,
    onBeforeRowHeaderRender: args => {
      if (args.row.data.seats && args.row.columns[0]) {
        args.row.columns[1].html = args.row.data.seats + ' seats';
      }
    },
    onRowFilter: args => {
      const seatsMatching = args.row.data.seats >= this.seatFilter;
      const timeMatching = !this.timeFilter || !args.row.events.all().some(e => this.overlaps(e.start(), e.end(), this.timeFilter.start, this.timeFilter.end));

      args.visible = seatsMatching && timeMatching;
    },
    onBeforeCellRender: args => {
      args.cell.backColor = "#dddddd";
    },
    onEventClick: args => {
      this.booking_detail = this.bookingData.filter((b) => {
        if (b.booking_id == args.e.data.id) return b;
      })[0]
      this.modalService.open(this.gallaryModalref, { centered: true });
    },
  };

  booking_detail: any = {}

  constructor(
    private modalService: NgbModal,
    private restService: RestaurantService,
    private authService: AuthService,
    private toastrService: ToastrService,
    private http: HttpClient,
    private datePipe: DatePipe,
    private cookieService:CookieService

    // private datePipe: DatePipe,

  ) { }

  table_seats = [];

  bookingDateEvent: any[] = [];
  bookingData = [];
  allBookings: any;
  pageIndex= 0;
  pageSize= 20;
  fromDate: Date = new Date('');
  toDate: Date = new Date('');
  bookingFormDate : any
  bookingToDate : any
  bookingStatus : any = null
  EventDate:any
  bookingCount: any;
  pageSizeOptions: number[] = [20, 50, 100];
  statusOptions = ['pending', 'closed', 'approved'];
  pdfFormattedDate: string;
  formattedDateTime: string;
  runsheetBooking: any;



  ngOnInit() {
    this.getAllBookings()
    // this.restService.getBookingInfo({ rest_id: this.cookieService.getItem('default_rest_id') }).then((res) => {
    //   var _seat = res.seats;
    //   this.bookingData = res.booking;

    //   this.bookingDateEvent = res.booking.map((b) => {
    //     return {
    //       id: b.booking_id,
    //       resource: b.seat_id,
    //       text: b.customer_name,
    //       start: new DayPilot.Date(b.start),
    //       end: new DayPilot.Date(b.start).addMinutes(150),
    //       backColor: b.status == 'pending' ? this.pendingColor : (b.status == 'approved' ? this.approvedColor : this.closedColor),
    //       barHidden: true
    //     }
    //   });
    //   for (let opt of env.seatOptions) {
    //     var _table_seat = {
    //       id: '',
    //       name: '',
    //       expanded: true,
    //       children: []
    //     };
    //     _table_seat.id = opt;
    //     _table_seat.name = opt;
    //     // _table_seat.children
    //     var seatArr = _seat.filter((s) => {
    //       if (s.option == opt) return s;
    //     });

    //     for (let s of seatArr) {
    //       var _group = {
    //         id: '',
    //         name: '',
    //         seats: ''
    //       };
    //       _group.id = s.id,
    //         _group.name = 'Table_' + s.table_no;
    //       _group.seats = s.seat_count;
    //       _table_seat.children.push(_group);
    //     }
    //     if (seatArr.length > 0) {
    //       this.table_seats.push(_table_seat);
    //     }
    //   }
    //   this.config.resources = this.table_seats;
    // })
  }
  generatePDF() {
    this.isLoading = true
    this.bookingStatus = 'approved'
    this.pdfFormattedDate = this.datePipe.transform(this.bookingToDate, 'EEEE MMMM d, yyyy');

    this.http.get<any>(`${environment.apiUrl}/v1/booking?rest_id=${this.cookieService.get('default_rest_id')}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}${this.bookingToDate && `&fromDate=${this.bookingToDate}`}${this.bookingToDate && `&toDate=${this.bookingToDate}`}&status=approved `)
    // this.http.get<any>(`${environment.apiUrl}/v3/getblogs`,{params})

    .subscribe(
      (res) => {
        this.runsheetBooking = res.data;
        this.bookingCount = res.count
        const currentDate = new Date();
        this.formattedDateTime = this.datePipe.transform(currentDate, "hh:mm:ss MMMM dd, yyyy");
      
        pdfMake.vfs = pdfFonts.pdfMake.vfs;

        const documentDefinition = {
          content: [
            {
              columns: [
                {
                  stack: [
                    
                    { text: this.cookieService.get('rest_name'), style: 'headerLeft1', alignment: 'left' },
                    { text: 'confirm booking', style: 'headerLeft2', alignment: 'left' },
                    { text: `Total guests: ${this.runsheetBooking.length}`, style: 'headerLeft3', alignment: 'left' }
                  ],
                  width: 'auto'
                },
                {
                  stack: [
                    { text: this.pdfFormattedDate, style: 'headerCenter1', alignment: 'center' },
                  ],
                  width: '*'
                },
                {
                  stack: [
                    { text: `Report generated at `, style: 'headerRight1', alignment: 'right' },
                     { text: `${this.formattedDateTime}`, style: 'headerRight2', alignment: 'right' }
                  ],
                  width: 'auto'
                }
              ]
            },
      
            {
              width: '100%',
    
              table: {
                widths: ['*', '*', '*'], // Set equal width for each column
    
                body: [
                  ['Customer Name', 'Booking Time', 'No of person'],
                  // Iterate over your array of objects and populate the table
                  ...this.runsheetBooking.map(obj => [obj.customer_name, obj.booking_time, obj.person_no]),
                ]
              }
            }
          ], 
           footer(currentPage, pageCount) {
            return { text: `Page ${currentPage.toString()} of ${pageCount.toString()}`, alignment: 'center' };
          },
          styles: {
            headerLeft1: {
              fontSize: 12,
              bold: true,
              margin: [0, 0, 0, 5] // top, right, bottom, left
            },
            headerLeft2: {
              fontSize: 10,
              margin: [0, 0, 0, 5] // top, right, bottom, left
            },
            headerLeft3: {
              fontSize: 10,
              margin: [0, 0, 0, 10] // top, right, bottom, left
            },
            headerCenter1: {
              fontSize: 12,
              bold: true,
              margin: [0, 0, 0, 5] // top, right, bottom, left
            },
            headerCenter2: {
              fontSize: 10,
              margin: [0, 0, 0, 10] // top, right, bottom, left
            },
            headerRight1: {
              fontSize: 10,
              margin: [0, 0, 0, 5] // top, right, bottom, left
            },
            headerRight2: {
              fontSize: 10,
              margin: [0, 0, 0, 10] // top, right, bottom, left
            }
          }
        };
        this.isLoading = false

      
      
        pdfMake.createPdf(documentDefinition).download(`DineOutHalal_${this.cookieService.get('rest_name')}_${this.bookingFormDate} bookings.pdf`);
        this.bookingFormDate = null
        this.bookingToDate = null
        this.bookingStatus = null
        this.toDate = null
        this.modalService.dismissAll();

      },
      error => {
        //  this.isLoading = false;
      })  
  
  
  }
  getAllBookings() {

    this.http.get<any>(`${environment.apiUrl}/v1/booking?rest_id=${this.cookieService.get('default_rest_id')}&pageIndex=${this.pageIndex}&pageSize=${this.pageSize}${this.bookingFormDate && `&fromDate=${this.bookingFormDate}`}${this.bookingToDate && `&toDate=${this.bookingToDate}`}${this.bookingStatus && `&status=${this.bookingStatus}`} `)
      // this.http.get<any>(`${environment.apiUrl}/v3/getblogs`,{params})

      .subscribe(
        (res) => {
          this.allBookings = res.data;
          this.bookingCount = res.count

        },
        error => {
          //  this.isLoading = false;
        })
  }
  changeStatus(e, bookingID , item) {
   
    let params = {
      booking_id: bookingID,
      status: e
    }
    this.restService.updateBookingStatus(params).subscribe((res) => {
      this.toastrService.success('Server Data Successfully Updated', 'success');
    })
    if (e === 'approved'){
    let paramss = {
      person: item.person_no ,
      bookingdate: item.booking_date,
      paid_at: item.booking_date,
    }

    this.http.post<any>(`${environment.apiUrl}/v1/chargeBookingCommision/${this.restId}`, paramss)
      .subscribe(
        res => {
        },
        err => {
        }
      );
  }
}
  changeQueryStatus(e,) {
    this.bookingStatus = e;

   
  
  }
  handlePageEvent2(event){
   this.pageIndex = event.pageIndex;
   this.pageSize = event.pageSize;
    this.getAllBookings()
  }
  filterBooking(){
    this.getAllBookings()
  }
  reset(){
    this.fromDate = new Date('');
    this.toDate = new Date('');
    this.bookingStatus= ''
  }
  dateChange() {
    this.config.startDate = this.navigator.control.selectionStart;
    this.config.days = new DayPilot.Duration(this.navigator.control.selectionStart, this.navigator.control.selectionEnd).totalDays() + 1;
  }
  onDateChange(event: any) {
  
    this.bookingFormDate = this.datePipe.transform(event, 'MM/dd/yyyy');
    this.fromDate = new Date(this.bookingFormDate);

    
  }
  onToDateChange(event: any) {
  
   this.bookingToDate = this.datePipe.transform(event, 'MM/dd/yyyy');
    this.toDate = new Date(this.bookingToDate);

    
  }
  seatFilterChange(ev): void {
    this.scheduler.control.rows.filter({});
  }

  clearTimeFilter(): boolean {
    this.timeFilter = null;
    this.scheduler.control.update();
    return false;
  }

  overlaps(start1, end1, start2, end2): boolean {
    return !(end1 <= start2 || start1 >= end2);
  }

  handleBooking(id, status) {
    this.bookingDateEvent.forEach((e) => {
      if (e.id == id) {
        if (status == 'approved') {
          e.backColor = this.approvedColor
        } else {
          e.backColor = this.closedColor
        }
      }
    })
    this.bookingData.forEach((e) => {
      if (e.booking_id == id) {
        if (status == 'approved') {
          e.status = 'approved';
        } else {
          e.status = 'closed';
        }
      }
    })
    this.modalService.dismissAll();
    let params = {
      booking_id: id,
      status: status
    }
    this.restService.updateBookingStatus(params).subscribe((res) => {
      this.toastrService.success('Server Data Successfully Updated', 'success');
    })
  }
  openRunSheetModal(content) {
    this.modalService.open(content, { centered: true });
  


  }

  declineBooking(id) {

  }

}
