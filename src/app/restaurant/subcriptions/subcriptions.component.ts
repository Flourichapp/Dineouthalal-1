import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService, RestaurantService } from '../../_services';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../config';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie-service';
import { ChangeDetectorRef, ElementRef } from '@angular/core';
import { EventService } from '../../restaurant/event.service';

@Component({
  selector: 'app-subcriptions',
  templateUrl: './subcriptions.component.html',
  styleUrls: ['./subcriptions.component.scss']
})
export class SubcriptionsComponent implements OnInit {
  monthly_flag: any = 'monthly';
  agreeTC = false;
  totalAmount: any = 75;
  duration: any = "month";
  trans: any;
  message: any;
  _showPaymentSide: Boolean = false;
  expiredAt: any;
  stripeKey: any


  restId = this.cookieService.get('default_rest_id');

  payemntStatus: any;
  stripeData: any;
  submitted: any;
  loading: any;
  stripePricesList: any;
  monthlyPriceId: any;
  yearlyPriceId: any;
  stripeMonthAmount: any
  stripeYearAmount: any
  stripe_customer_id: any;
  cardDetails: any;
  stripe_subscription_id: any
  disableRadio: Boolean = false;
  isLoading: Boolean = false;
  products: any[] = [];
  prices: any[] = [];
  showMonthlyPrices = false;
  selectedPriceOption = 'monthly';
  selectedPrice: any = {}; // Variable to store the selected price

  product_id: any;
  subscriptionFlag: any = 'monthly';
  priceID: any;
  amount: any;
  trialdays: any;
  packageName: any;
  discount: any;
  trialMonth: any;
  MyProductId: any;
  MyPriceId: any;
  package_id: any;
  AllProducts: any;

  constructor(
    private modalService: NgbModal,
    private toastService: ToastrService,
    private authService: AuthService,
    private restService: RestaurantService,
    private http: HttpClient,
    private cookieService: CookieService,
    private el: ElementRef,
    private eventService: EventService



  ) { }

  ngOnInit(): void {

    this.stripeKey = env.STRIPE_SECRET
    if (this.restId) {
      this.getCustomerID();
    }
    this.getAllPackages();
    this.getSinglePackages();


  }
  emitEvent() {
    this.eventService.emitEvent({ message: 'Hello from Example Component!' });
  }

  getSinglePackages() {

    let package_id = this.cookieService.get('package_id');

    // if(typeof parseInt(package_id) == 'number'){
    if (package_id !== 'null') {

      this.http.get<any>(`${environment.apiUrl}/admin/v0/package?id=${package_id}`)
        .subscribe(
          (res) => {
            this.MyProductId = res.data.product_id
            this.MyPriceId = res.data.price_id
          },

        );
    }


  }
  getAllPackages() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json', 'Authorization': `Bearer ${this.stripeKey}` });

    this.http.get<any>(`${environment.apiUrl}/admin/v0/packages`)
      .subscribe(productsResponse => {
        this.products = productsResponse.data;
        this.http.get<any>('https://api.stripe.com/v1/prices', { headers }).subscribe(pricesResponse => {
          this.prices = pricesResponse.data;
          this.matchPricesToProducts();
        });
      });
  }
  parseValue(data: string): string[] {
    try {
      const dataArray = JSON.parse(data);
      if (Array.isArray(dataArray)) {
        return dataArray;
      }
    } catch (error) {
      console.error('Error parsing data:', error);
    }
    return [];
  }
  parseFeatures(noFeaturesString: string): string[] {
    try {
      const featuresArray = JSON.parse(noFeaturesString);
      if (Array.isArray(featuresArray)) {
        return featuresArray;
      }
    } catch (error) {
    }
    return [];
  }
  matchPricesToProducts() {
    this.products.forEach(product => {
      product.price_monthly = this.prices.find(p => p.product === product.product_id && p.recurring.interval === 'month');
      product.price_yearly = this.prices.find(p => p.product === product.product_id && p.recurring.interval === 'year');
      product.selectedPriceOption = 'monthly'; // Set default to 'monthly'

    });
  }
  updateSelectedPrice(product: any, option: 'monthly' | 'yearly') {
    product.selectedPriceOption = option;
  }
  getSubscription(item, content) {
    this.modalService.open(content, { size: "md", windowClass: 'custom-delete-modal-class', centered: true });
    this.product_id = item.product_id
    this.packageName = item.title
    if (this.subscriptionFlag === 'monthly') {
      this.priceID = item.price_monthly?.id
      this.amount = item.price_monthly.unit_amount
      this.trialdays = item.price_monthly.recurring.trial_period_days
      this.trialMonth = this.trialdays / 30
    }
    if (this.subscriptionFlag === 'yearly') {
      this.priceID = item.price_yearly?.id
      this.amount = item.price_yearly.unit_amount
      this.trialdays = item.price_yearly.recurring.trial_period_days
      this.trialMonth = this.trialdays / 30
    }

  }

  removeSubscription() {
    this.isLoading = true
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json', 'Authorization': `Bearer ${this.stripeKey}` });

    this.http.delete<any>(`https://api.stripe.com/v1/subscriptions/${this.stripe_subscription_id}`, { headers })
      .subscribe(
        (res) => {

          setTimeout(() => {
            // this.getCustomerID();
            this.isLoading = false
            this.modalService.dismissAll();
            this.MyProductId = null
            this.cookieService.set('package_id', "null");
            // this.getSinglePackages();
            this.emitEvent();

          }, 2100);


        },
        error => {
        })

  }
  getCustomerID() {
    const headers = new HttpHeaders({ 'Content-Type': 'application/ld+json', 'Authorization': `Bearer ${this.stripeKey}` });

    this.http.get<any>(`${environment.apiUrl}/v1/getSingleSubscription/${this.restId}`)
      .subscribe(
        (res) => {
          this.stripe_customer_id = res.stripe_customer_id
          this.stripe_subscription_id = res.stripe_subscription_id
          if (this.stripe_subscription_id) {
            this.disableRadio = true
          }
          else {
            this.disableRadio = false

          }
          this.http.get<any>(`https://api.stripe.com/v1/customers/${this.stripe_customer_id}/sources`, { headers })
            .subscribe(
              (res) => {

                this.cardDetails = res.data

              },
              error => {
              }
            );
        },
        error => {
        })

  }
  openDeleteModal(content) {
    this.modalService.open(content, { centered: true });

  }
  showPaymentForm(content) {
    this.modalService.open(content, { centered: true });
  }
  changePriceMonthly() {
    this.subscriptionFlag = 'monthly'


  }
  changePriceYearly() {
    this.subscriptionFlag = 'yearly'


  }
  changePricePlan(e) {

    if (e.value === 'monthly') {
      this.totalAmount = (this.stripeMonthAmount / 100)
      this.duration = "month"
    }
    if (e.value === 'yearly') {
      this.totalAmount = (this.stripeYearAmount / 100)
      this.duration = "year"

    }

  }
  stripePaymentCallback(result) {
    this.loading = true;
    if (result.token) {
      var params = {
        restaurant_id: this.restId,
        amount: this.amount,
        subscriptionFlag: this.subscriptionFlag,
        product_id: this.product_id,
        token_id: result.token.id,
        price_id: this.priceID,
        trialdays: this.trialdays,
        user_id: this.authService.getUserId()
      }
      this.restService.stripePayment(params)
        .subscribe(async (res) => {
          this.loading = false;
          this.toastService.success('Successfully Paid', 'success', { timeOut: 1500 })
          this.modalService.dismissAll();
          this.getCustomerID();
          const updatedPackageId = res?.data?.package_id;
          await this.cookieService.set('package_id', updatedPackageId);

          this.getSinglePackages();
          this.emitEvent();


        }, (err) => {
          this.loading = false;
        })
    } else if (result.error) {
      this.loading = false;
      this.toastService.error('Payment Is not Done Successfully', 'error', { timeOut: 1500 })
      this.modalService.dismissAll(); // Close the modal when payment is successful	
    }
  }
  blogSlides = {

    "slidesToShow": 3,
    "slidesToScroll": 1,
    "nextArrow": "<i class='fa fa-arrow-left slick-next'></i>",
    "prevArrow": "<i class='fa fa-arrow-right slick-prev'></i>",
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
          'slidesToShow': 3
        }
      },
      {
        'breakpoint': 1024,
        'settings': {
          'slidesToShow': 2
        }

      },
      {
        'breakpoint': 992,
        'settings': {
          'slidesToShow': 1
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



  slickInit(e) {
  }

  breakpoint(e) {
  }

  afterChange(e) {
  }

  beforeChange(e) {
  }
}
