import { Injectable } from '@angular/core';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Capacitor } from '@capacitor/core';
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {

  public phoneNumberUtil = PhoneNumberUtil.getInstance();
   
  platform = Capacitor.getPlatform();

  constructor() { }

  openPhone(number: string) {
    window.open(`tel:${number}`);
  }

  openSms(number: string) {
    window.open(`sms:${number}`);
  }

  //FIXME
  openGroupSms(numbersArray: string []){
    const numbers = numbersArray.join(',');

    if(this.platform === 'ios' || this.platform === 'web') {
      // hack for opening group text thread in iOS "https://sethmlarson.dev/sms-urls"
      window.open(`sms://open?addresses=${numbers}`);
    } else {
      window.open(`sms:${numbers}`)
    }
  }
}
