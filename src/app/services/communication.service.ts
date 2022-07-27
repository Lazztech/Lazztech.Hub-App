import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  constructor() { }

  openPhone(number: string) {
    window.open(`tel:${number}`);
  }

  openSms(number: string) {
    window.open(`sms:${number}`);
  }
}
