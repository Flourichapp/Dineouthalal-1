import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { environment } from '../../../environments/environment';
import cityData from '../../shared/cities_in_uk.json';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HomeService } from '../../_services';
import { Title, Meta } from '@angular/platform-browser';

import { HttpClient } from '@angular/common/http';

import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HomeComponent implements OnInit {

  constructor(
    private homeService: HomeService,

    private http: HttpClient,
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private toastr: ToastrService,
    private metaTagService: Meta,

  ) { 

  }

 
  currentPath: string = '/';
  subscribeForm: UntypedFormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  imageUrl: any;
  

  error = '';
  location: any;
  myCurrentLocation : null

  myControl = new UntypedFormControl();
  categoryFilter = new UntypedFormControl();
  cusineFilter = new UntypedFormControl();

  options: string[] = [];
  filteredOptions: Observable<string[]>;
  cusineList: Observable<string[]>;


  rate: any = 4.7;

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  
  currentRate = 3.7;

  greatCities: any = [
    {
      img: "/assets/images/cities/london.jpg",
      name: "London",
      desc: 'London'
    },
    {
      img: "/assets/images/cities/manchester.jpg",
      name: "Manchester",
      desc: 'Manchester'
    },
    {
      img: "/assets/images/cities/birmingham.jpg",
      name: "Birmingham",
      desc: 'Birmingham'
    },
    {
      img: "/assets/images/cities/glasgow.jpg",
      name: "Glasgow",
      desc: 'Glasgow'
    },
  ];


  category: any = "";
  area: any = '';
  cusine: any = '';
  search: any = '';
  blogs: any;
  
  featureblogs: any;
  popularRests: any;
  city: any = "London";


  toprests: any;
  // halalcertifiedrests: any;

  ngOnInit() {
    this.homeService.getMetaDataByRouteName(this.currentPath)

   
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.options.push("Near Me");

    for (let city of cityData.locations) {
      this.options.push(city.city);
    }

    this.subscribeForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
    this.imageUrl = environment.apiUrl
    this.getLandingPageData();
    this.getLandingPageFeaturedBlogs();
    this.getLandingPageCuisine();
    this.getLandingPagePopularRests();
  }

  getLandingPagePopularRests(): void {
    this.homeService.getLandingPagePopularRests(this.city)
     .subscribe(
       (res) => {
        //  this.popularRests = res.data
        this.popularRests = res['data'];
         this.popularRests = this.popularRests.map(rest => {
           const foodTypes = rest.food_types &&JSON.parse(rest.food_types).map(type => {
             return type.split('_').map(word => {
               return word.charAt(0).toUpperCase() + word.slice(1);
             }).join(' ');
           }).join(', ');
      
           return {
             ...rest,
             food_types: foodTypes
           };
         });
      
       },
       error => {

        })
  }
  getLandingPageFeaturedBlogs(): void {
    
    this.homeService.getLandingPageBlogs()
      .subscribe(
        (res) => {
          this.featureblogs = res['featuredBlogsById']
        },
        error => {

        })
  }
  getLandingPageCuisine(): void {
    this.homeService.getLandingPageCuisine()
      .subscribe(
        (res) => {
          var arr2 = res['rows'].map(v => (v.title));
          this.cusineList = arr2;
        },
        error => {
        })
 
  }
  getLandingPageData(): void {
    this.homeService.getLandingPageData()
    .subscribe(
      (res) => {
        this.blogs = res['data'].blogs;
        this.toprests = res['data'].toprests.map(rest => {
          const foodTypes = rest.food_types && JSON.parse(rest.food_types).map(type => {
            return type.split('_').map(word => {
              return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
          }).join(', ');
          return {
            ...rest,
            food_types: foodTypes
          };
        });
        
      },
      error => {
  
      })
  }
  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(this.showPosition.bind(this));
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }
  showPosition = (position: any) => {
    this.location = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    };

    const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${this.location.latitude}&lon=${this.location.longitude}`;
    this.http.get(apiUrl).subscribe((response: any) => {
      const city = response.address.town;
      if(response.address.town){
        this.myCurrentLocation = response.address.town
      }
      if(response.address.city){
        this.myCurrentLocation = response.address.city
      }
    });
    
    this.http.get(apiUrl).subscribe((response: any) => {
      const city = response.address.city;
    });
  }

  displayFilterValue(value: string): string {
    switch (value) {
      case 'halal_certified':
        return 'Halal Certified';
      case 'halal_friendly':
        return 'Halal Friendly';
      case 'no_alcohol':
        return 'No alcohol';
        case 'all':
        return 'All';
      default:
        return '';
    }
  }

  // convenience getter for easy access to form fields
  get f() { return this.subscribeForm.controls; }

  onSubmit() {
    // alert('here');
    this.submitted = true;

    // stop here if form is invalid
    if (this.subscribeForm.invalid) {
      return;
    }

    this.loading = true;
    var params = {
      email: this.f.email.value,
    }

    // this.toastr.success('Hello world!', 'Toastr fun!');

    // this.http.post<any>(`${environment.apiUrl}/v3/registerSubscriber`, params)
    //   .subscribe(
    //     (res) => {
    //       this.loading = false;
    //       this.submitted = false;
    //       this.subscribeForm.controls['email'].setValue('');
    //       if (res && res.message == 'already') {
    //         this.toastr.success('You already registered', 'Thanks');
    //       } else {
    //         this.toastr.success('Successfully registered', 'Thanks');
    //       }
    //     },
    //     error => {
    //       this.loading = false;
    //       this.toastr.error('Something Went Wrong, please try later', 'Error');
    //     })
  }

  searchHotels(): void {
    const encodedSearch = encodeURIComponent(this.search);
    const queryParams = {
      search: encodedSearch || null
    };
  
    this.router.navigate(['search'], { queryParams });
  }

  goHalalCertified() {
    this.router.navigate(['search'], { queryParams: { category: encodeURIComponent('halal_certified') } });
  }

  goToListPage(loc) {
    this.router.navigate(['search'], { queryParams: { area: encodeURIComponent(loc) } });
  }
  responsive = {

  };

  slides = [
    { img: "/assets/images/banners/slider1.webp" },
    // { img: "/assets/images/banners/slider2.webp" },
  ];

  portfolioCarousel = {
    loop: true,
    dots: false,
    margin: 10,
    items: 4,
    // nav: true,
    // autoplay: true,
    // autoplayTimeout: 5500,
    navText: ["<i class='mdi mdi-chevron-left'></i>", "<i class='mdi mdi-chevron-right'></i>"]
  }

  slideConfig = {

    "slidesToShow": 1,
    "slidesToScroll": 1,
    "nextArrow": "<i class='fa fa-arrow-left slick-next'></i>",
    "prevArrow": "<i class='fa fa-arrow-right slick-prev'></i>",
    "dots": false,
    "infinite": false,
    "arrows": true,
    "autoplay": true,
    "autoplaySpeed": 3000,
    "lazyLoad": 'ondemand',
    'responsive': [
      {
        'breakpoint': 900,
        'settings': {
          'slidesToShow': 1
        }
      }
    ]
  };
  resturantSlide = {

    "slidesToShow":5,
    "slidesToScroll": 1,
    "nextArrow": "<i class='fa fa-angle-right slick-next'></i>",
    "prevArrow": "<i class='fa fa-angle-left  slick-prev'></i>",
    // prevArrow:"<img class='a-left control-c prev slick-prev' src='../images/shoe_story/arrow-left.png'>",
    // nextArrow:"<img class='a-right control-c next slick-next' src='../assets/images/market.png'>",
    "dots": true,
    "infinite": false,
    "arrows": true,
    "autoplay": false,
    "autoplaySpeed": 3000,
    "lazyLoad": 'ondemand',
    'responsive': [
      {
        'breakpoint': 1200,
        'settings': {
          'slidesToShow': 4
        }
      },
      {
        'breakpoint': 1024,
        'settings': {
          'slidesToShow': 3
        }

      },
      {
        'breakpoint': 992,
        'settings': {
          'slidesToShow': 2
        }

      },
      {
        'breakpoint': 767,
        'settings': {
          'slidesToShow': 1
        }

      }
    ]
  };
  blogSlides = {

    "slidesToShow": 5,
    "slidesToScroll": 1,
    "nextArrow": "<i class='fa fa-arrow-left slick-next'></i>",
    "prevArrow": "<i class='fa fa-arrow-right slick-prev'></i>",
    "dots": true,
    "infinite": false,
    "arrows": true,
    "autoplay": true,
    "autoplaySpeed": 3000,
    "lazyLoad": 'ondemand',
    'responsive': [
      {
        'breakpoint': 1200,
        'settings': {
          'slidesToShow': 4
        }
      },
      {
        'breakpoint': 1024,
        'settings': {
          'slidesToShow': 3
        }

      },
      {
        'breakpoint': 992,
        'settings': {
          'slidesToShow': 2
        }

      },
      {
        'breakpoint': 767,
        'settings': {
          'slidesToShow': 1
        }

      }
    ]
  };



  // halalcertifiedRests = [
  //   { img: "/assets/images/sliders/slide_3.png", title: 'Restaruant 1' },
  //   { img: "/assets/images/sliders/slide_2.png", title: 'Restaruant 2' },
  //   { img: "/assets/images/sliders/slide_1.png", title: 'Restaruant 3' },
  //   { img: "/assets/images/sliders/slide_3.png", title: 'Restaruant 4' },
  //   { img: "/assets/images/sliders/slide_2.png", title: 'Restaruant 5' },
  //   { img: "/assets/images/sliders/slide_1.png", title: 'Restaruant 6' },
  // ];



  blogSlideConfig = {
    "slidesToShow": 4,
    "slidesToScroll": 1,
    "dots": true,
    "infinite": false,
    "arrows": true,
    // "autoplay": true,
    // "autoplaySpeed": 3000,
    "responsive": [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1
        }
      }
    ]
  };


  addSlide() {
    this.slides.push({ img: "http://placehold.it/350x150/777777" })
  }

  removeSlide() {
    this.slides.length = this.slides.length - 1;
  }

  slickInit(e) {
  }

  breakpoint(e) {
  }

  afterChange(e) {
  }

  beforeChange(e) {
  }
}
