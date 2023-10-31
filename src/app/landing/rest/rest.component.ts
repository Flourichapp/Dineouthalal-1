import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { env } from '../../config';
import { environment } from '../../../environments/environment';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
// import { io } from 'socket.io-client';
import { AuthService } from 'src/app/_services';
import { DatePipe } from '@angular/common';
import { common as Const } from '../../_const/common';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Location } from '@angular/common';
import { HomeService } from '../../_services';

@Component({
  selector: 'app-rest',
  templateUrl: './rest.component.html',
  styleUrls: ['./rest.component.scss']
})


export class RestComponent implements OnInit {

  // socket = io('10.99.4.49:4000');
  // socket = io(environment.apiUrl);
  @ViewChild('bookingTab') bookingTab: ElementRef;
  @ViewChild('restTab') restTab: ElementRef;

  // @HostListener('window:scroll')
  // handleScroll() {
  //   const windowScroll = window.pageYOffset;
  //   if (this.availableFixed) {
  //     if (windowScroll >= this.bookingTabPosition && windowScroll < this.limitHeight) {
  //       this.style = 'margin-top: ' + (windowScroll - this.bookingTabPosition) + 'px';
  //     } else {
  //       this.style = 'margin-top: 0px';
  //     }
  //   } else {
  //     this.style = 'margin-top: 0px';
  //   }
  // }

  // @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 700) {
      this.availableFixed = false;
    } else {
      this.availableFixed = true;
    }
  }

  bookingTabPosition: any;

  style: any = "";
  availableFixed = true;
  UserId: any;
  limitHeight: any;
  imageURL: any;
  restaurant_id: any;

  success: any;

  _today = new Date();

  seatOptions = [
    { name: 'Table Booking', disabled: false, value: 'tablebooking' },
    { name: 'Corporate Booking', disabled: false, value: 'corporatebooking' },
    { name: 'Private Booking', disabled: false, value: 'privatebooking' }
  ];

  pickTimesConst: string[] = env.pickTimes;


  bookvar = {
    date: new Date(),
    time: '11:30',
    seat: '1',
    // seatopt: ''
  }

  restId: any = '';
  restSlug: any = '';
  isSearching: Boolean = false;
  images: any;
  imagesLenth: Boolean = false;
  avgRating: any;
  totalRating: any;
  rating: any
  currentUser: any;
  fullimage: any;
  reviews: any;
  currentDate: string;
  currentDate2 = new Date()
  currentTime: string;

  rest: any = {};
  title: any;

  offerMenus;
  fullMenus: any[] = [];

  menus = [];
  food_types = []

  availableSeat: any;
  newDate: any;
  thumbnail: any;

  filePath: any;
  fullFilePath: any;

  enableBooking: Boolean = true;
  showTable : Boolean =  false;

  blockDates: string[] = [];

  bookingForm: UntypedFormGroup;

  submitted: Boolean = false;
  bookingStarted: Boolean = false;
  onSubmitting: Boolean = false;
  isUser: Boolean = false;
  customerName: any
  image: string;
  currentIndex: number;
  newcurrentTime: any;
  currentPath: string;
  access_list = [];
  full_access: any;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private formBuilder: UntypedFormBuilder,
    private toastrService: ToastrService,
    private authService: AuthService,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private cookieService :CookieService,
    private homeService: HomeService,
    private location: Location
  ) {
    this.getCurrentDateTime();

  }



  ngOnInit(): void {
    this.currentPath = this.location.path();
    const encodedPath = encodeURIComponent(this.currentPath);

    this.homeService.getMetaDataByRouteName(encodedPath)
    const currentDateTime = new Date();
    this.currentDate = currentDateTime.toLocaleString();
    this.currentTime = currentDateTime.toLocaleTimeString([], { hour12: false });

    // Current time with seconds
    let currentTime = new Date();

    // Round off minutes to nearest half hour
    let minutes = currentTime.getMinutes();
    if (minutes >= 1 && minutes <= 29) {
      currentTime.setMinutes(30);
    } else if (minutes >= 31 && minutes <= 59) {
      currentTime.setMinutes(0);
      currentTime.setHours(currentTime.getHours() + 1);
    }
    
    // Formatted time in 24-hour format
    let formattedTime = currentTime.toTimeString().substr(0, 5);

    this.bookvar.time = formattedTime;
    if(this.cookieService.get(Const.USER)){
       this.currentUser = JSON.parse(this.cookieService.get(Const.USER));
      this.customerName = `${this.currentUser?.first_name} ${this.currentUser?.last_name}`
      this.UserId = this.currentUser?.id
      }


    // this.currentUser = JSON.parse(this.cookieService.get(Const.USER));
    // this.customerName = this.currentUser?.first_name ? `${this.currentUser?.first_name} ${this.currentUser?.last_name}` :null
    // this.UserId = this.currentUser.id ? this.currentUser.id : null
    var restname, id, date, time, seat;
    this.activateRoute.params.subscribe(params => {
      restname = params['restname'];
      this.restSlug = restname
    });

    this.imageURL = environment.apiUrl



    // var _a = restname.split('?');
    // if (_a.length > 1) {
    //   if (_a[1].indexOf('&d=') > 0) {
    //     id = _a[1].substring(0, _a[1].indexOf('&d='));
    //     this.restId = id;
    //     if (_a[1].indexOf('&t=') > 0) {
    //       date = _a[1].substring(_a[1].indexOf('&d='), _a[1].indexOf('&t=')).replace('&d=', '');
    //       if (date) {
    //         this.bookvar.date = new Date(date);
    //       }
    //       if (_a[1].indexOf('&s=') > 0) {
    //         time = _a[1].substring(_a[1].indexOf('&t='), _a[1].indexOf('&s=')).replace('&t=', '');
    //         if (time) {
    //           this.bookvar.time = time;
    //         }

    //         seat = _a[1].substring(_a[1].indexOf('&s=')).replace('&s=', '');
    //         if (seat) {
    //           this.bookvar.seat = seat;
    //         }
    //       };
    //     };
    //   };
    // }

    if (this.restSlug != '') {
      this.getDataOnRest('first');

    } else {
      this.router.navigate(['/search']);
    }

    this.formInit();

    this.setCustomerCategoryValidators();

    // this.socket.on('FromAPI', (data: string) => {
    // });
  }
  getCurrentDateTime() {
    const currentDateTime = new Date();
    this.currentDate = currentDateTime.toLocaleString();
    this.currentTime = currentDateTime.toLocaleTimeString([], { hour12: false });
    const newdate: Date = new Date(this.currentDate);
    const bookvarDate = new Date(this.bookvar.date.getFullYear(), this.bookvar.date.getMonth(), this.bookvar.date.getDate());
    const newdateDate = new Date(newdate.getFullYear(), newdate.getMonth(), newdate.getDate());
    if (bookvarDate.getTime() === newdateDate.getTime()) {
      const [currentHour, currentMinute, currentSecond] = this.currentTime.split(':').map(Number);
      const originalPickTimes: string[] = env.pickTimes;
      const modifiedPickTimes: string[] = [];
      for (let time of originalPickTimes) {
        const [hour, minute] = time.split(':').map(Number);
        if (hour > currentHour || (hour === currentHour && minute > currentMinute)) {
          modifiedPickTimes.push(time);
        }
      }
      this.pickTimesConst = modifiedPickTimes
    }
    else {
      this.pickTimesConst = env.pickTimes;
    }

  }




  openModal(content: any, index: number) {
    this.modalService.open(content, { centered: true });
    this.currentIndex = index;
  }
  next() {
    if (this.currentIndex < this.images.length - 1) {
      this.currentIndex++;
    }
  }

  previous() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    }
  }
  formInit() {


    var user = this.authService.getUser();
    var isCustomer = this.authService.isCustomer();

    if (user && isCustomer) {
      this.isUser = true;
    }

    this.bookingForm = this.formBuilder.group({
      firstname: [''],
      lastname: [''],
      customerCategory: ['ever'],
      email: [this.isUser ? user.email : '', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirm_password: ['']
    });

    if (this.isUser) {
      this.bookingForm.controls['email'].disable();
    }

  }

  goBack() {
    this.router.navigate(['/search']);
  }

  // this is only for scroll and resize event
  ngAfterViewInit() {
    // if (window.innerWidth < 700) {
    //   this.availableFixed = false;
    // } else {
    //   this.availableFixed = true;
    // }
    this.bookingTabPosition = this.bookingTab.nativeElement.offsetTop;
    this.limitHeight = this.restTab.nativeElement.offsetHeight + this.bookingTabPosition;
  }

  // convenience getter for easy access to form fields


  getDataOnRest(flag) {
    this.isSearching = true;
    let params = {
      slug: this.restSlug,
      date: this.bookvar.date,

      time: this.bookvar.time,
      seatNum: this.bookvar.seat,
      // seatOpt: this.bookvar.seatopt,
      flag: flag
    }
    this.http.post<any>(`${environment.apiUrl}/v3/getrestdata`, params)
      .subscribe(
        (res) => {


          if (flag == 'first') {
            // let obj = this.access_list.findIndex(o => o.slug === 'table-booking');
            this.access_list = res.data.accesslist;
            this.full_access = res.data.rest.full_access

            const obj = this.access_list.find(o => o.slug === "table-booking");
            if(obj || this.full_access === 1){
              this.showTable = true
            }

            this.rest = res.data.rest;
            this.title = this.rest.title
            this.restaurant_id = this.rest.restaurant_id
            this.rating = res.data.rest.ratings;
            this.totalRating = res.data.rest?.review_count;
            this.avgRating = (this.rating / this.totalRating)
            this.thumbnail = this.rest.thumbnail
            this.food_types = JSON.parse(this.rest.food_types);
            this.food_types = this.food_types && this.food_types.map((type) => {
              return type.charAt(0).toUpperCase() + type.slice(1).replace('_', ' ');
            });

            this.images = res.data.images;
            if (res.data.images.length > 5) {
              this.imagesLenth = true
            }
            this.reviews = res.data.reviews;
            this.offerMenus = this.rest.offer_menu ? JSON.parse(this.rest.offer_menu) : [];
            this.images.map((value, index) => {
              value['image'] = this.imageURL + '/' + value.image;
              value['thumbImage'] = this.imageURL + '/' + value.thumbImage;



            })

            this.fullimage = JSON.stringify(this.images)

            this.blockDates = JSON.parse(this.rest.block_date);

            this.menus = res.data.menus;
            const menuWithFile = this.menus.find(menu => menu.file !== null && menu.file !== undefined);
            if (menuWithFile) {
              this.filePath = menuWithFile.file;
            } else {
              this.filePath = null; // handle case where no menu has a file property
            }
            this.fullFilePath = `${this.imageURL}/${this.filePath}`

            var _fullmenu = this.rest.full_menu ? JSON.parse(this.rest.full_menu) : [];
            for (let fm of _fullmenu) {
              this.fullMenus.push({
                image: fm,
                thumbImage: fm,
              })
            }

        
          }

          this.availableSeat = res.data.one_av_seat;

          if (this.availableSeat.length > 0) {
            this.enableBooking = true;
          } else {
            this.enableBooking = false;
          }

          this.isSearching = false;

        },
        error => {

          this.isSearching = false;
        })
  }

  get f() {
    return this.bookingForm.controls;
  }


  changeVariable() {

    this.getCurrentDateTime()
    this.getDataOnRest('search');

  }

  // changeRadioVariable(e) {
  //   this.bookvar.seatopt = e.value;
  //   this.getDataOnRest('search');
  // }

  book() {
    // if (this.bookvar.seatopt == '') {
    //   Swal.fire({
    //     title: 'Wrong!',
    //     text: 'Please select Seat Option!',
    //     icon: 'warning',
    //     width: 400
    //   })
    //   return;
    // }
    if (this.UserId) {
      this.onSubmit()

    }
    else {
      this.bookingStarted = !this.bookingStarted;

    }
  }

  error: any;



  onSubmit() {
    // alert('here');
    this.submitted = true;
    this.newDate = this.datePipe.transform(this.bookvar.date, 'M/d/yyyy');

    if (this.f.customerCategory.value == 'first') {
      const confirmPasswordControl = this.bookingForm.get('confirm_password');
      const passwordControl = this.bookingForm.get('password');
      if (confirmPasswordControl.value != passwordControl.value) {
        confirmPasswordControl.setErrors({ notSame: true })
        return;
      }
    }



    this.onSubmitting = true;
    let params = {
      seat_id: 0,
      rest_id: this.rest.restaurant_id,

      // first_name: this.bookingForm.controls.firstname.value,
      first_name: this.bookingForm.controls.firstname.value ? this.bookingForm.controls.firstname.value : this.customerName,
      UserId: this.UserId ? this.UserId : null,
      customer_cat: this.bookingForm.controls.customerCategory.value,
      last_name: this.bookingForm.controls.lastname.value,
      email: this.bookingForm.controls.email.value,
      password: this.bookingForm.controls.password.value,
      date: this.newDate,
      time: this.bookvar.time,
      person: this.bookvar.seat
    }

    this.http.post<any>(`${environment.apiUrl}/v3/booking`, params)
      .subscribe(
        res => {
          this.onSubmitting = false;
          this.bookingStarted = false;
          this.error = null;
          this.toastrService.success('Successfully Booked', 'succss');
          this.success = 'Your booking successfully done!';
          this.getDataOnRest('search');
          this.formInit();
          this.setCustomerCategoryValidators();
          setTimeout(() => {
            this.success = null;
          }, 2000);
          // this.socket.emit('bookingRoute', { room: 'ererere' });

        },
        err => {
          this.error = err.error.message;
          this.onSubmitting = false;
          this.toastrService.error('Some Error Happens', 'error')
        }
      );
  }

  setCustomerCategoryValidators() {
    const firstnameControl = this.bookingForm.get('firstname');
    const lastnameControl = this.bookingForm.get('lastname');
    const confirmPasswordControl = this.bookingForm.get('confirm_password');
    const passwordControl = this.bookingForm.get('password');

    this.bookingForm.get('customerCategory').valueChanges
      .subscribe(userCategory => {

        if (userCategory === 'first') {
          firstnameControl.setValidators([Validators.required]);
          lastnameControl.setValidators([Validators.required]);
          confirmPasswordControl.setValidators([Validators.required, f => {
            return passwordControl.value == confirmPasswordControl.value ? null : { notSame: true }
          }]);
        }

        if (userCategory === 'ever') {
          firstnameControl.setValidators(null);
          lastnameControl.setValidators(null);
          confirmPasswordControl.setValidators(null);
        }

        firstnameControl.updateValueAndValidity();
        lastnameControl.updateValueAndValidity();
        confirmPasswordControl.updateValueAndValidity();
      });
  }

  changeCustomerCategory(e) {
    this.error = null;
  }

}
