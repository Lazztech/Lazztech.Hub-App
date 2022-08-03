import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';

@Pipe({
  name: 'phoneNumberFormatter'
})
export class PhoneNumberFormatterPipe implements PipeTransform {

  phoneNumberUtil = PhoneNumberUtil.getInstance();

  transform(phoneValue: number | string, country: string): unknown {
    try {
      const phoneNumber = this.phoneNumberUtil.parse(phoneValue + '', country);
      return this.phoneNumberUtil.formatInOriginalFormat(phoneNumber);
    } catch (error) {
      return phoneValue;
    }
  }

}
