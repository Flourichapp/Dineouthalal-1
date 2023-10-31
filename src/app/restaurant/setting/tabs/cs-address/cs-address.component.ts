import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RestaurantService, AuthService } from '../../../../_services';
import { UntypedFormBuilder, UntypedFormGroup, Validators, UntypedFormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Setting, SettingAddress } from '../../../../_models/restaurant/setting';
import { SettingChangeEvent } from '../../../../_models/restaurant/SettingChangeEvent';
import { MouseEvent, MapsAPILoader, AgmMap } from "@agm/core";
import cityData from '../../../../shared/cities_in_uk.json';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { GoogleMapsAPIWrapper } from '@agm/core/services';
import { CookieService } from 'ngx-cookie-service';

declare var google: any;

@Component({
  selector: 'app-cs-address',
  templateUrl: './cs-address.component.html',
  styleUrls: ['./cs-address.component.scss']
})
export class CsAddressComponent implements OnInit {
  meta: any = {};
  infoForm: UntypedFormGroup;
  zoom: number = 15;
  private geoCoder;

  geocoder: any;

  @Input()
  // get firsttab(): FirstTab { return this._name; }
  set data(address: SettingAddress) {
    if (address) {
      this.infoForm = this.fb.group({
        country: address.country,
        state: address.state,
        city: address.city,
        address1: address.address1,
        address2: address.address2,
        postalcode: address.postalcode,
        lat: address.lat,
        lng: address.lng,
      });
      this.city.setValue(address.city);
    }
  };

  @Output() onUpdate = new EventEmitter<SettingChangeEvent>();

  constructor(
    private resService: RestaurantService,
    private authService: AuthService,
    private fb: UntypedFormBuilder,
    private toastrService: ToastrService,
    private mapsAPILoader: MapsAPILoader,
    public mapsApiLoader: MapsAPILoader,
    private cookieService :CookieService
    // private zone: NgZone,
    // private wrapper: GoogleMapsAPIWrapper

  ) {
    this.infoForm = this.fb.group({
      country: '',
      state: '',
      city: '',
      address1: '',
      address2: '',
      postalcode: '',
      lat: 0,
      lng: 0,
    });

    this.mapsApiLoader = mapsApiLoader;
    // this.zone = zone;
    // this.wrapper = wrapper;
    this.mapsApiLoader.load().then(() => {
      this.geocoder = new google.maps.Geocoder();
    });
  }

  protected map: any;

  mapReady(map) {
    this.map = map;
  }

  city = new UntypedFormControl();
  options: string[] = [];
  filteredOptions: Observable<string[]>;

  cityInfo: [];

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().indexOf(filterValue) === 0);
  }

  ngOnInit(): void {
    // this.mapsAPILoader.load().then(() => {
    this.setCurrentLocation();
    // });

    this.filteredOptions = this.city.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );

    for (let city of cityData.locations) {
      this.options.push(city.city);
    }

  }

  onSelectionChange(e) {
    var _city = cityData.locations.filter(city => {
      if (city.city == this.city.value) return city;
    });
    this.infoForm.patchValue({ "lat": _city[0].lat });
    this.infoForm.patchValue({ "lng": _city[0].lng });
    this.map.setCenter({ lat: parseFloat(_city[0].lat), lng: parseFloat(_city[0].lng) });
    this.findAddressByCoordinates(parseFloat(_city[0].lat), parseFloat(_city[0].lng));
  }

  private setCurrentLocation() {

    if ('geolocation' in navigator) {

      navigator.geolocation.getCurrentPosition((position) => {
        if (!this.f.lat.value && !this.f.lng.value) {
          this.infoForm.patchValue({ "lat": position.coords.latitude });
          this.infoForm.patchValue({ "lng": position.coords.longitude });
        }
      });
    }
  }


  get f() { return this.infoForm.controls; }

  mapClicked($event: MouseEvent) {
    this.infoForm.patchValue({ "lat": $event.coords.lat });
    this.infoForm.patchValue({ "lng": $event.coords.lng });

    // this.findAddressByCoordinates($event.coords.lat, $event.coords.lng);
  }

  markerDragEnd($event: MouseEvent) {
    this.infoForm.patchValue({ "lat": $event.coords.lat });
    this.infoForm.patchValue({ "lng": $event.coords.lng });

    this.findAddressByCoordinates($event.coords.lat, $event.coords.lng);
  }

  findAddressByCoordinates(lat, lng) {
    this.geocoder.geocode({
      'location': {
        lat: lat,
        lng: lng
      }
    }, (results, status) => {
      this.decomposeAddressComponents(results);
    })
  }
  findLatLongByAddress(value: string) {
    this.geocoder.geocode({
      'address': value
    }, (results, status) => {
      this.decomposeAddressComponents(results);
      const latitude = results[0].geometry.location.lat();
      const longitude = results[0].geometry.location.lng();
      this.map.setCenter({ lat: parseFloat(latitude), lng: parseFloat(longitude) });
      this.infoForm.patchValue({ "lat": latitude });
      this.infoForm.patchValue({ "lng": longitude });

    });
  }

  decomposeAddressComponents(addressArray) {
    if (addressArray.length == 0) return false;
    let address = addressArray[0].address_components;

    var _address = {
      address_1: '',
      address_2: '',
      postal_code: '',
      country: '',
      state: ''
    };

    for (let element of address) {
      if (element.length == 0 && !element['types']) continue;

      if (element['types'].indexOf('street_number') > -1) {
        _address.address_1 = element['long_name'];
        // this.location.address_level_1 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('route') > -1) {
        _address.address_1 += ', ' + element['long_name'];
        continue;
      }
      if (element['types'].indexOf('locality') > -1) {
        _address.address_2 = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('administrative_area_level_1') > -1) {
        _address.state = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('country') > -1) {
        _address.country = element['long_name'];
        continue;
      }
      if (element['types'].indexOf('postal_code') > -1) {
        _address.postal_code = element['long_name'];
        continue;
      }
    }

    this.infoForm.patchValue({ "state": _address.state });
    this.infoForm.patchValue({ "country": _address.country });
    this.infoForm.patchValue({ "address1": _address.address_1 });
    this.infoForm.patchValue({ "address2": _address.address_2 });
    this.infoForm.patchValue({ "postalcode": _address.postal_code });

  }
  clickedMarker() {
  }

  onSubmit() {

    var params = {
      restaurant_id: this.cookieService.get('default_rest_id'),
      country: this.f.country.value,
      city: this.city.value,
      state: this.f.state.value,
      address1: this.f.address1.value,
      address2: this.f.address2.value,
      postalcode: this.f.postalcode.value,
      lat: this.f.lat.value,
      lng: this.f.lng.value,
      settinglevel: 4,
    }
    this.resService.updateSettingAddress(params).subscribe(data => {

      var event = new SettingChangeEvent();
      event.tabid = 3;
      this.onUpdate.emit(event);

      this.toastrService.success("Success Saved", 'success');
    });
  }
}
