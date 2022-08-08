import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from 'src/app/services/alert/alert.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { ProfileService } from 'src/app/services/profile/profile.service';

@Component({
  selector: 'app-change-phone-number',
  templateUrl: './change-phone-number.page.html',
  styleUrls: ['./change-phone-number.page.scss'],
})
export class ChangePhoneNumberPage implements OnInit {

  loading = false;

  myForm: FormGroup;

  get phoneNumber() {
    return this.myForm.get('phoneNumber');
  }
  public countries: Array<{ code: number, flag: string, region: string}> = [];

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService,
    private alertService: AlertService,
    private readonly communicationService: CommunicationService,
  ) { }

  ngOnInit() {
    this.countries = this.communicationService.countryCodes();
    this.myForm = this.fb.group({
      phoneNumber: []
    });
  }

  async changePhoneNumber() {
    this.loading = true;

    const formValue = this.myForm.value;

    const result = await this.profileService.changeEmail(formValue.phoneNumber);
    if (result) {
      this.loading = false;
      this.alertService.presentToast('Changed phone number.');
    } else {
      this.loading = false;
      this.alertService.presentRedToast('Failed to change phone number.');
    }
  }

}
