import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsAPILoader, AgmMap, LatLngBounds } from '@agm/core';
import { UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { env } from '../../config';
import cityData from '../../shared/cities_in_uk.json';
import { Title, Meta } from '@angular/platform-browser';
import { HomeService } from '../../_services';
declare var google: any;

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable: boolean;
}

interface Location {
  lat: number;
  lng: number;
  viewport?: Object;
  zoom: number;
  address_level_1?: string;
  address_level_2?: string;
  address_country?: string;
  address_zip?: string;
  address_state?: string;
  marker?: Marker;

}

interface SearchFilter {
  area: string;
  cuisine: string;
  search: string;

  category: string;
  date: any;
  // time: string;
  seatNum: string;
  time: string;

  seatOpt: string[];
  priceOpt: string[];
  categoryOpt: string[];
  sort: string;
  pageIndex: number;
  pageSize: number;
  previousPageIndex: number;
  lat: any;
  lng: any;

}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})

export class SearchComponent implements OnInit {


  @ViewChild('AgmMap') agmMap: AgmMap;


  circleRadius = 10000;
  isFilterSectionVisible = false;


  //   milesToRadius(value) {
  //     this.circleRadius = value / 0.00062137;
  //  }

  //  circleRadiusInMiles() {
  //    return this.circleRadius * 0.00062137;
  //  }


  pickTimes: string[] = env.pickTimes;

  restMarkers: Marker[] = [];

  seatOptions = {
    tablebooking: { name: 'Table Booking', checked: false, value: 'tablebooking' },
    corporatebooking: { name: 'Corporate Booking', checked: false, value: 'corporatebooking' },
    privatebooking: { name: 'Private Booking', checked: false, value: 'privatebooking' }
  };

  priceOpts = {
    low: { value: 'low', checked: false },
    medium: { value: 'medium', checked: false },
    high: { value: 'high', checked: false },
  };
  categoryOpts = {
    HalalCertified: { value: 'halal_certified', checked: false },
    HalalFriendly: { value: 'halal_friendly', checked: false },
    NoAlcohol: { value: 'no_alcohol', checked: false },
  };

  cityAutocompleteCtrl = new UntypedFormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  location: Location = {
    lat: 51.5072,
    lng: -0.1275,
    marker: {
      lat: 51.678418,
      lng: -0.1275,
      draggable: true
    },
    zoom: 15
  };

  searchVar: SearchFilter = {
    area: '',
    cuisine: '',
    search:'',

    category: '',
    date: new Date(),//.toISOString(),
    // time: '12:30',
    time: '',

    seatNum: '1',
    seatOpt: [],
    priceOpt: [],
    categoryOpt: [],
    sort: '',
    pageIndex: 0,
    pageSize: 10,
    previousPageIndex: 0,
    lat: 0,
    lng: 0
  };
  _today = new Date();

  nearbyme = 'Near Me';

  rests: any[] = [];
  imageURL: any;
  searchParms: any;


  isSearching: Boolean = true;

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  mypos: any = {
    lat: 0,
    lng: 0,
  };
 
  currentPath: string = '/search';
  constructor(
    private activateRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private mapsAPILoader: MapsAPILoader,
    private metaTagService: Meta,
    private homeService: HomeService,

  ) {
  }
  isData: boolean = false
  ngOnInit(): void {
    this.homeService.getMetaDataByRouteName(this.currentPath)

    this.activateRoute.queryParams.subscribe(params => {
      // this.searchVar.area = params.area ? decodeURIComponent(params.area) : '';
      // this.searchVar.category = params.category ? params.category : '';
      // this.searchVar.cuisine = params.cuisine ? params.cuisine : '';
      const encodedSearch = params.search ? params.search : '';
      this.searchVar.search = decodeURIComponent(encodedSearch);

      

      this.imageURL = environment.apiUrl
    });


    navigator.geolocation.getCurrentPosition(resp => {

      this.mypos.lat = resp.coords.latitude;
      this.mypos.lng = resp.coords.longitude;

      this.searchVar.lat = this.mypos.lat;
      this.searchVar.lng = this.mypos.lng;

      this.getResult({
        // area: this.searchVar.area,
        // cuisine: this.searchVar.cuisine,
        search:this.searchVar.search,

        // category: this.searchVar.category,
        lat: this.mypos.lat,
        lng: this.mypos.lng,//
      });

      this.location.marker.draggable = false;

      this.filteredOptions = this.cityAutocompleteCtrl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value))
      );

      this.options.push(this.nearbyme);
      for (let city of cityData.locations) {
        this.options.push(city.city);
      }

    },
      err => {
        this.getResult(this.searchVar);
      })
    // 

  }

  toggleFilterSection() {
    this.isFilterSectionVisible = !this.isFilterSectionVisible;
  }
  toggleSearch() {
    this.getResult({
      // area: this.searchVar.area,
      // cuisine: this.searchVar.cuisine,
      search:this.searchParms,

      // category: this.searchVar.category,
      lat: this.mypos.lat,
      lng: this.mypos.lng,//
    });
  }
  onEnter() {
    this.toggleSearch(); // Call the existing function when Enter key is pressed
  }
  changePage(e) {
    this.searchVar.pageIndex = e.pageIndex;
    this.searchVar.pageSize = e.pageSize;
    this.searchVar.previousPageIndex = e.previousPageIndex;
    this.getResult(this.searchVar);
  }

  getResult(params) {
    this.isSearching = true;
    this.http.post<any>(`${environment.apiUrl}/v3/getsearchdata`, params)
      .subscribe(
        (res) => {
          this.length = res.count;
          this.rests = res.rests;
          // for (let i=0; i<this.rests.length; i++) {
          //   this.rests[i].avgRating = this.rests[i].ratings / this.rests[i].review_count;
          // }
          
          this.rests = res.rests.map(rest => {
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

          this.isSearching = false;
          this.setBounds();
          //  window.scrollTo({ left: 0, top: 0, behavior: 'smooth' }); //disable temoprary by imad
        },
        error => {
          this.length = 0
          this.isSearching = false;
          this.rests = [];
          this.setBounds();
        })


  }
  bounds: any;

  setBounds() {
    this.mapsAPILoader.load().then(() => {

      const _bounds: LatLngBounds = new google.maps.LatLngBounds();
      if (this.rests.length > 1) {
        for (const mm of this.rests) {
          _bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
        }
      } else if (this.rests.length == 1) {
        for (const mm of this.rests) {
          _bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
          _bounds.extend(new google.maps.LatLng(mm.lat - 0.001, mm.lng - 0.002));
          _bounds.extend(new google.maps.LatLng(mm.lat + 0.001, mm.lng + 0.002));
        }
      } else {
        _bounds.extend(new google.maps.LatLng(this.mypos.lat, this.mypos.lng));
        _bounds.extend(new google.maps.LatLng(this.mypos.lat - 0.002, this.mypos.lng - 0.004));
        _bounds.extend(new google.maps.LatLng(this.mypos.lat + 0.002, this.mypos.lng + 0.004));
      }
      this.bounds = _bounds;
    });
  }



  showDetail(restname) {
    this.router.navigate(['/rest/' + restname], { queryParams: { d: encodeURIComponent(this.searchVar.date), s: this.searchVar.seatNum } });
  }

  search() {

    var _seatOptions = Object.values(this.seatOptions);
    this.searchVar.seatOpt = [];
    for (let _s of _seatOptions) {
      if (_s.checked) this.searchVar.seatOpt.push(_s.value);
    }


    var _priceOpts = Object.values(this.priceOpts);
    this.searchVar.priceOpt = [];
    for (let _p of _priceOpts) {
      if (_p.checked) this.searchVar.priceOpt.push(_p.value);
    }
    var _categoryOpts = Object.values(this.categoryOpts);
    this.searchVar.categoryOpt = [];
    this.searchVar.category = ""
    for (let _t of _categoryOpts) {
      if (_t.checked) this.searchVar.categoryOpt.push(_t.value);
      if (_t.checked) this.searchVar.category = _t.value

    }

    this.getResult(this.searchVar);
    this.isFilterSectionVisible = false
  }

  sort() {
    this.getResult(this.searchVar);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }
}
