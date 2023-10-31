import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { UntypedFormBuilder, Validators, UntypedFormGroup } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_services';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2'
import { ConfirmedValidator } from 'src/app/_helpers';
import { common as Const } from '../../_const/common';
import { ActivatedRoute,Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
  encapsulation: ViewEncapsulation.None

})

export class UserComponent implements OnInit {
  @ViewChild('canvas') canvasRef: ElementRef<HTMLCanvasElement>;

  constructor(
    private activateRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private modalService: NgbModal,
    private toastrService: ToastrService,
    private formBuilder: UntypedFormBuilder,
    private datePipe: DatePipe,
    private cookieService : CookieService
  ) { }
  bookings: any;
  bookingDetail: any;
  dataForm: UntypedFormGroup;
  endTime : any = "23:00";

  pastBooking: any;
  upcommingBooking: any;
  pendingBooking: any;
  isEdit: Boolean = false;
  imageURL: any;
  food_mark: number = 0;
  service_mark: number = 0;
  ambience_mark: number = 0;
  review_content: any;
  favorites: any;
  favoriteRestIds: any[] = [];
  rest_id;
  resturant_id;
  resturant_email: any;

  seat_id;
  date: any;
  time: any;
  timmeee: any;
  formattedDate: any;
  imageUrl: any = 'assets/images/dummy.jpg';

  person: any;
  seat_type: number = 1;
  isInvalid: Boolean = false;
  booking_id;
  signinForm: UntypedFormGroup;
  submitted: Boolean = false;
  loading: Boolean = false;
  changeablepwd: Boolean = false;
  currentUser;
  error = '';
  timeOptions: string[] = ["9:00", "10:00", "11:00", "12:00"];
  dateValue: Date = new Date('');
  selectedTime: string;

  message: string;
  tabName: any;
  activeTabValue : any;
  bookingID :any

  sendEmail() {

    const recipient = this.resturant_email;
    const subject = 'inquiry from Customer';
    const body = `%0D%0A ${this.message} %0D%0A %0D%0A`;
    const mailtoUrl = `mailto:${recipient}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;
    // Clear the message once the email is sent
    this.message = '';
    this.isEdit = false
  }

  ngOnInit(): void {
    var tabname;
    this.activateRoute.params.subscribe(params => {
      tabname = params['tabname'];
      this.tabName = tabname
    });

    this.activateRoute.queryParams.subscribe(params => {
      this.bookingID = params['id'];
      if (params.id) {
        this.isEdit = true;
        this.bookingDetailsData();

      } else {
        this.isEdit = false;
      }
    });
    
    
    if(this.tabName === 'booking'){
      this.activeTabValue = 0

    }
    if(this.tabName === 'saved-restaurant'){
      this.activeTabValue = 1

    }
    if(this.tabName === 'details'){
      this.activeTabValue = 2

    }
    if(this.tabName === 'change-password'){
      this.activeTabValue = 3

    }
    if(this.tabName === 'payment-details'){
      this.activeTabValue = 4

    }
    

    this.dataForm = this.formBuilder.group({
      user_id: ['', Validators.required],
      profile_picture: [null],
    });
    this.currentUser = JSON.parse(this.cookieService.get(Const.USER));
    this.getMypageData()


    this.signinForm = this.formBuilder.group({
      oldpwd: ['', Validators.required],
      password: ['', Validators.required],
      confirm_password: ['', Validators.required],
    }, {
      validator: ConfirmedValidator('password', 'confirm_password')
    });
    this.imageURL = environment.apiUrl


  }
  updateUrl(tabIndex: number) {
    let tabName: string;
    this.isEdit = false

    switch (tabIndex) {
      case 0:
        tabName = 'booking';
        break;
      case 1:
        tabName = 'saved-restaurant';

        break;
        case 2:
          tabName = 'details';
          break;
        case 3:
          tabName = 'change-password';
          break;
         
      default:
        tabName = 'payment-details';
        break;
    }
    this.router.navigateByUrl(`/profile/${tabName}`);
  }
 
  get d() { return this.dataForm.controls; }

  onProfileSubmit() {

    let params = this.makeParam();
    this.http.put<any>(`${environment.apiUrl}/v2/profile`, params)

      .subscribe(
        (res) => {
          this.cookieService.set(Const.USER, JSON.stringify(res.customer[0]));
          this.currentUser = JSON.parse(this.cookieService.get(Const.USER));

          // this.bookings = res.bookings;
          // this.favorites = res.favorites;

          this.toastrService.success('Successfully Updated Profile Image', 'success', {
            timeOut: 1500
          })
        },
        error => {

        })


  }
  uploadFile(event) {
    this.imageUrl = ''
    const file = (event.target as HTMLInputElement).files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = event => {
        this.imageUrl = reader.result;
        this.currentUser.avatar = null

      };
    }
    this.dataForm.patchValue({
      profile_picture: file
    });

    this.dataForm.get('profile_picture').updateValueAndValidity()
  }
  makeParam() {
    var formData: any = new FormData();
    formData.append("user_id", this.currentUser.id);
    formData.append("profile_picture", this.dataForm.value.profile_picture);

    return formData;
  }

  Times = [
    { id: 0, value: '00:00' }, { id: 1, value: '00:30' }, { id: 2, value: '01:00' }, { id: 3, value: '01:30' },
    { id: 4, value: '02:00' }, { id: 5, value: '02:30' }, { id: 6, value: '03:00' },
    { id: 7, value: '03:30' }, { id: 8, value: '04:00' }, { id: 9, value: '04:30' },
    { id: 10, value: '05:00' }, { id: 11, value: '05:30' }, { id: 12, value: '06:00' },
    { id: 13, value: '06:30' }, { id: 14, value: '07:00' }, { id: 15, value: '07:30' },
    { id: 16, value: '08:00' }, { id: 17, value: '08:30' }, { id: 18, value: '09:00' },
    { id: 19, value: '09:30' }, { id: 20, value: '10:00' }, { id: 21, value: '10:30' },
    { id: 22, value: '11:00' }, { id: 23, value: '11:30' }, { id: 24, value: '12:00' },
    { id: 25, value: '12:30' }, { id: 26, value: '13:00' }, { id: 27, value: '13:30' },
    { id: 28, value: '14:00' }, { id: 29, value: '14:30' }, { id: 30, value: '15:00' },
    { id: 31, value: '15:30' }, { id: 32, value: '16:00' }, { id: 33, value: '16:30' },
    { id: 34, value: '17:00' }, { id: 35, value: '17:30' }, { id: 36, value: '18:00' },
    { id: 37, value: '18:30' }, { id: 38, value: '19:00' }, { id: 39, value: '19:30' },
    { id: 40, value: '20:00' }, { id: 41, value: '20:30' }, { id: 42, value: '21:00' },
    { id: 43, value: '21:30' }, { id: 44, value: '22:00' }, { id: 45, value: '22:30' },
    { id: 46, value: '23:00' }, { id: 47, value: '23:30' }
  ]


  bookingDetailsData(){
    
    this.http.get<any>(`${environment.apiUrl}/v2/booking/${this.bookingID}`)
    .subscribe(
      (res) => {
        //  this.bookingDetail = res.bookings
        if (res.bookings && res.bookings.length > 0) {
          this.bookingDetail = res.bookings[0];
          const time1 = this.bookingDetail.booking_time; // original time
          const hoursToAdd = 2; // number of hours to add
          const date = new Date(); // create a new Date object
          const [hours, minutes] = time1.split(":"); // split the original time into hours and minutes
          date.setHours(parseInt(hours) + hoursToAdd, parseInt(minutes)); // add the number of hours to the hours of the date object
          let time2 = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}); // format the new time as a string with leading zeros and in 24-hour format
          
          this.endTime = time2
        }

       
        
      },
      error => {

      })

  }
  getMypageData() {
    this.http.post<any>(`${environment.apiUrl}/v2/getmypageinfo`, { user_id: this.authService.getUserId() })
      .subscribe(
        (res) => {
          this.bookings = res.data.bookings;
          this.favorites = res.data.favorites;
          this.favorites = res.data.favorites.map(rest => {
            const foodTypes = JSON.parse(rest.food_types).map(type => {
              return type.split('_').map(word => {
                return word.charAt(0).toUpperCase() + word.slice(1);
              }).join(' ');
            }).join(', ');

            return {
              ...rest,
              food_types: foodTypes
            };
          });
          this.pastBooking = this.bookings.filter(item => item.status === 'closed');
          this.upcommingBooking = this.bookings.filter(item => item.status === 'approved');
          this.pendingBooking = this.bookings.filter(item => item.status === 'pending');

          this.favorites.forEach(element => {
            this.favoriteRestIds.push(element.restaurant_id);
          });



        },
        error => {

        })
  }
  selectedLevel = 2;
  data: Array<Object> = [
    { id: 0, name: 'name1' },
    { id: 1, name: 'name2' },
    { id: 2, name: 'name3' },
    { id: 3, name: 'name4' },
  ];

  seatOptions = [
    { id: 0, name: 'Table Booking', disabled: false, value: 'tablebooking' },
    { id: 1, name: 'Corporate Booking', disabled: false, value: 'corporatebooking' },
    { id: 2, name: 'Private booking', disabled: false, value: 'privatebooking' }
  ];
  persons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, "more"];


  openReviewModal(content, rest_id, booking_id) {
    this.ambience_mark = 0;
    this.food_mark = 0;
    this.service_mark = 0;
    this.review_content = '';
    this.modalService.open(content, { centered: true });
    this.rest_id = rest_id;
    this.booking_id = booking_id
  }

  openEditModal(content, bookingObj) {

    this.timmeee = bookingObj.booking_time;
    this.modalService.open(content, { centered: true });
    this.resturant_id = bookingObj.restaurant_id;
    this.seat_id = bookingObj.seat_id;
    this.date = bookingObj.booking_date;
    this.person = bookingObj.person_no;
    this.booking_id = bookingObj.id;
    this.dateValue = new Date(this.date);
    const selectedSeatOption = this.seatOptions.find(option => option.value === bookingObj.seat_type);
    this.seat_type = selectedSeatOption ? selectedSeatOption.id : null;

    const selectedTime = this.Times.find(option => option.value === bookingObj.booking_time);
    this.time = selectedTime ? selectedTime.id : null;



  }
  openDeleteModal(content, bookingId) {
    this.modalService.open(content, { centered: true });
    this.booking_id = bookingId;



  }
  editBooking() {

    this.isInvalid = false;
    var params = {
      rest_id: this.rest_id,
      content: this.review_content,
      food_mark: this.food_mark,
      service_mark: this.service_mark,
      ambience_mark: this.ambience_mark,
      booking_id: this.booking_id

    }


    this.modalService.dismissAll();
    this.http.post<any>(`${environment.apiUrl}/v2/savereview`, params)
      .subscribe(
        (res) => {
          this.bookings = res.data.bookings;
          this.favorites = res.data.favorites;
          // this.favorites.forEach(element => {
          //   this.favoriteRestIds.push(element.restaurant_id);
          // });
          this.toastrService.success('Successfully Updated Review', 'success', {
            timeOut: 1500
          })
        },
        error => {

        })
  }
  onSeatChange(e: any) {
    this.seat_type = e;
  }
  onPersonChange(e: any) {
    this.person = e;
  }
  onTimeChange(e: any) {
    this.time = e;
    const selectedTimeOption = this.Times.find(option => option.id === parseInt(e));
    const selectedTimeOptionValue = selectedTimeOption ? selectedTimeOption.value : null;
    this.timmeee = selectedTimeOptionValue

  }
  onDateChange(event: any) {
    this.dateValue = event;
    this.formattedDate = this.datePipe.transform(event, 'MM/dd/yyyy');

  }

  saveReview() {
    var sum_mark = (this.food_mark + this.service_mark + this.ambience_mark) / 3;
    if (!this.review_content) {
      Swal.fire({
        title: 'Warning',
        icon: 'error',
        text: 'You should put review content'
      });
      this.isInvalid = true;
      return;
    }
    this.isInvalid = false;
    var params = {
      rest_id: this.rest_id,
      user_id: this.authService.getUserId(),
      content: this.review_content,
      food_mark: this.food_mark,
      service_mark: this.service_mark,
      ambience_mark: this.ambience_mark,
      mark: sum_mark.toFixed(2),
      booking_id: this.booking_id
    }


    this.modalService.dismissAll();
    this.http.post<any>(`${environment.apiUrl}/v2/savereview`, params)
      .subscribe(
        (res) => {
          this.bookings = res.data.bookings;
          this.favorites = res.data.favorites;
          // this.favorites.forEach(element => {
          //   this.favoriteRestIds.push(element.restaurant_id);
          // });
          this.toastrService.success('Successfully Updated Review', 'success', {
            timeOut: 1500
          })
        },
        error => {

        })
  }
  cancelBooking() {

    this.isInvalid = false;
    var params = {
      booking_id: this.booking_id,
      status: "closed"
    }
    this.modalService.dismissAll();
    this.http.post<any>(`${environment.apiUrl}/v1/booking/updatebookingstatus`, params)
      .subscribe(
        (res) => {
          this.toastrService.success('Successfully Updated Review', 'success', {
            timeOut: 1500
          })
          this.getMypageData()
        },
        error => {
        })
  }
  editCurrentBooking() {
    this.isInvalid = false;
    var params = {
      rest_id: this.resturant_id,
      seat_id: this.seat_type,
      date: this.formattedDate,
      time: this.timmeee,
      person: this.person,
    }
    this.modalService.dismissAll();
    this.http.put<any>(`${environment.apiUrl}/v3/booking/${this.booking_id}`, params)
      .subscribe(
        (res) => {

          // this.favorites.forEach(element => {
          //   this.favoriteRestIds.push(element.restaurant_id);
          // });
          this.toastrService.success('Successfully Updated Review', 'success', {
            timeOut: 1500

          })
          this.getMypageData()

        },
        error => {

        })
  }
  addFavroite(rest_id) {
    Swal.fire({
      icon: 'success',
      title: 'Thanks',
      text: 'This restaurant will add your favorite list  !!!',
      showCancelButton: true
    }).then(result => {
      if (result.value) {
        this.http.post<any>(`${environment.apiUrl}/v2/addremovefavorite`, { rest_id: rest_id, user_id: this.authService.getUserId(), flag: 'add' })
          .subscribe(
            (res) => {
              this.favorites = res.data.favorites;
              this.favorites.forEach(element => {
                this.favoriteRestIds.push(element.restaurant_id);
              });
              this.toastrService.success('Successfully Added to Favorite', 'success', {
                timeOut: 1500
              })
            },
            error => {

            })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  removeFavorite(rest_id) {
    Swal.fire({
      icon: 'warning',
      title: 'Warning',
      text: 'This restaurant will removed from your favorite list  !!!',
      showCancelButton: true
    }).then(result => {
      if (result.value) {
        this.http.post<any>(`${environment.apiUrl}/v2/addremovefavorite`, { rest_id: rest_id, user_id: this.authService.getUserId(), flag: 'remove' })
          .subscribe(
            (res) => {
              this.favorites = res.data.favorites;
              this.favorites.forEach(element => {
                this.favoriteRestIds.push(element.restaurant_id);
              });
              this.toastrService.success('Successfully Added to Favorite', 'success', {
                timeOut: 1500
              })
            },
            error => {

            })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    })
  }

  get f() { return this.signinForm.controls; }

  onSubmit() {
    this.submitted = true;

    if (this.signinForm.invalid) {
      return;
    }

    this.loading = true;

    var params = {
      user_id: this.authService.getUserId(),
      oldpwd: this.f.oldpwd.value,
      password: this.f.password.value,
    }

    this.http.post<any>(`${environment.apiUrl}/v2/auth/changepassword`, params)
      .subscribe(
        res => {
          this.submitted = false;
          this.loading = false;
          this.changeablepwd = false;
          this.toastrService.success('Successfully Updated', 'success', { timeOut: 1500 });

        },
        err => {
          this.submitted = false;
          this.loading = false;
          this.error = err.error.message;
          this.toastrService.error('Some Error Happens', 'error', { timeOut: 1500 })
        }
      );
  }
  onEdit(item: any) {
    this.bookingID = item.id
    this.bookingDetailsData();
    this.isEdit = true;

    // this.bookingDetail = item;
    const time1 = item.booking_time; // original time
    const hoursToAdd = 2; // number of hours to add
    const date = new Date(); // create a new Date object
    const [hours, minutes] = time1.split(":"); // split the original time into hours and minutes
    date.setHours(parseInt(hours) + hoursToAdd, parseInt(minutes)); // add the number of hours to the hours of the date object
    let time2 = date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', hour12: false}); // format the new time as a string with leading zeros and in 24-hour format
    
    this.endTime = time2


    this.resturant_email = item.email



  }
}
