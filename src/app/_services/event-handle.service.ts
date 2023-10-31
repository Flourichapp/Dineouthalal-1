import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventHandleService {

  private loginUser = new BehaviorSubject(null);
  currentLoggedIn = this.loginUser.asObservable();

  constructor() { }

  changeLoginStatus(rest: string) {
    this.loginUser.next(rest)
  }
}
