import { Injectable } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  public phoneNumberUtil = PhoneNumberUtil.getInstance();

  constructor() { }

  openPhone(number: string) {
    window.open(`tel:${number}`);
  }

  openSms(number: string) {
    window.open(`sms:${number}`);
  }
}
