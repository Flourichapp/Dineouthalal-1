import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
 
import { StripeService, StripeCardComponent } from 'ngx-stripe';
import {
  StripeCardElementOptions,
  StripeElementsOptions
} from '@stripe/stripe-js';
import { RestaurantService } from 'src/app/_services';


@Component({
  selector: 'app-pay',
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.scss']
})
export class PayComponent implements OnInit {

  // @Input() rest_id:any;
  @ViewChild(StripeCardComponent) card: StripeCardComponent;
  @Output() onUpdate = new EventEmitter<any>();
 
  cardOptions: StripeCardElementOptions = {
    style: {
      base: {
        iconColor: '#673ab7',
        color: '#673ab7',
        fontWeight: '300',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSize: '18px',
        '::placeholder': {
          color: '#b0a1cc'
        }
      }
    },
    hidePostalCode:true
  };
 
  elementsOptions: StripeElementsOptions = {
    locale: 'en'
  };
 
  stripeTest: UntypedFormGroup;
  isLoading: boolean = false
 
  constructor(
    private fb: UntypedFormBuilder, 
    private stripeService: StripeService,
    private restService: RestaurantService
    ) {}
 
  ngOnInit(): void {
    this.stripeTest = this.fb.group({
      name: ['', [Validators.required]]
    });
  }
 
  createToken(): void {
    this.isLoading = true;
    const name = this.stripeTest.get('name').value;
    this.stripeService
      .createToken(this.card.element, { name })
      .subscribe((result) => {
        
        this.onUpdate.emit(result);

      });
  }
}
