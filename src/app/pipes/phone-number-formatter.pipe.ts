import { Pipe, PipeTransform } from '@angular/core';
import { PhoneNumberUtil, PhoneNumber } from 'google-libphonenumber';
import { CommunicationService } from '../services/communication.service';

@Pipe({
  name: 'phoneNumberFormatter'
})
export class PhoneNumberFormatterPipe implements PipeTransform {
  
  constructor(
    private communicationService: CommunicationService,
  ) { }

  transform(phoneValue: number): unknown {
    try {
      const phoneNumber = this.communicationService.phoneNumberUtil.parse(phoneValue + '');
      return this.communicationService.phoneNumberUtil.formatOutOfCountryCallingNumber(phoneNumber);
    } catch (error) {
      return phoneValue;
    }
  }

}
