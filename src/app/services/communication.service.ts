import { Injectable } from '@angular/core';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
import getUnicodeFlagIcon from 'country-flag-icons/unicode'

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

  countryCodes() {
    return this.phoneNumberUtil.getSupportedRegions().map(region => ({
      code: this.phoneNumberUtil.getCountryCodeForRegion(region),
      flag: getUnicodeFlagIcon(region),
      region: region,
    }));
  }
}
