import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { NavController } from '@ionic/angular';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { CommunicationService } from 'src/app/services/communication.service';
import { environment } from 'src/environments/environment';
import { AgeRestrictionValidator } from '../../../directives/age-restriction.directive';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  loading = false;

  myForm: UntypedFormGroup;

  ageRestriction = 16;

  get firstName() {
    return this.myForm.get('firstName');
  }

  get lastName() {
    return this.myForm.get('lastName');
  }

  get birthdate() {
    return this.myForm.get('birthdate');
  }

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  get phoneNumber() {
    return this.myForm.get('phoneNumber');
  }

  public countries: Array<{ code: number, flag: string, region: string}> = [];

  constructor(
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private readonly communicationService: CommunicationService,
  ) { }

  ngOnInit() {
    this.countries = this.communicationService.countryCodes();
    this.myForm = this.fb.group({
      firstName: ['', [
        Validators.required
      ]],
      lastName: ['', [
        Validators.required
      ]],
      birthdate: ['', [
        Validators.required,
        AgeRestrictionValidator(this.ageRestriction)
      ]],
      phoneNumber: [],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(10)
      ]]
    });
  }

  async register() {
    this.loading = true;
    try {
      const formValue = this.myForm.value;
      const birthdateTimestamp = Date.parse(formValue.birthdate).toString();
      const token = await this.authService.register(
        formValue.firstName,
        formValue.lastName,
        birthdateTimestamp,
        formValue.email,
        formValue.password,
        this.phoneNumber.value,
      );
  
      if (token) {
        await this.authService.login(formValue.email, formValue.password);
        this.loading = false;
        await this.navCtrl.navigateRoot('/tabs');
      } else {
        this.loading = false;
        this.alertService.presentToast('Registration Failed');
      }
    } catch (error) {
      this.loading = false;
      this.alertService.presentRedToast(error);
    }
  }

  async navigateToPrivacyPolicy() {
    await Browser.open({ url: environment.legal.privacyPolicyLink });
  }

  async navigateToTermsAndConditions() {
    await Browser.open({ url: environment.legal.termsAndConditions });
  }

}
