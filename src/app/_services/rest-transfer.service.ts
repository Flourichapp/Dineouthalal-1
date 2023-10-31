import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RestTransferService {

  private restSource = new BehaviorSubject(null);
  currentRest = this.restSource.asObservable();

  constructor() { }

  changeRest(rest: string) {
    this.restSource.next(rest)
  }

}