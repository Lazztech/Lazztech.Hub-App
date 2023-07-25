import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Config, MenuController, NavController } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from 'src/app/services/alert/alert.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  loading = false;
  myForm: UntypedFormGroup;
  returnUrl: string;
  public mode: string;

  get email() {
    return this.myForm.get('email');
  }

  get password() {
    return this.myForm.get('password');
  }

  constructor(
    private menu: MenuController,
    private authService: AuthService,
    private navCtrl: NavController,
    private logger: NGXLogger,
    private alertService: AlertService,
    private fb: UntypedFormBuilder,
    private readonly route: ActivatedRoute,
    private readonly errorService: ErrorService,
    private readonly config: Config,
    public readonly themeService: ThemeService,
  ) {
    this.menu.enable(false);
    this.returnUrl = this.route?.snapshot?.queryParams['returnUrl'];
    this.mode = this.config.get("mode");
  }

  ngOnInit() {
    this.myForm = this.fb.group({
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
    await this.navCtrl.navigateForward('/register', {
      queryParams: {
        returnUrl: this.returnUrl,
      },
    });
  }

  async resetPassword() {
    await this.navCtrl.navigateForward('/reset-pin', {
      queryParams: {
        returnUrl: this.returnUrl,
      },
    });
  }

  async login() {
    this.loading = true;
    const formValue = this.myForm.value;
    try {
      const token = await this.authService.login(formValue.email, formValue.password);
      if (token) {
        this.loading = false;
        await this.navCtrl.navigateRoot(this.returnUrl || '/tabs');
      }
    } catch (error) {
      this.alertService.presentRedToast(`Login failed: ${error}`, 5000);
      this.loading = false;
    }
  }

  async navigateToPrivacyPolicy() {
    await Browser.open({ url: environment.legal.privacyPolicyLink });
  }

  async navigateToTermsAndConditions() {
    await Browser.open({ url: environment.legal.termsAndConditions });
  }

  async expeditedRegistration() {
    try {
      this.loading = true;
      const result = await this.authService.expeditedRegistration();
      if (result.jwt) {
        this.loading = false;
        await this.navCtrl.navigateRoot(this.returnUrl || '/tabs');
      } else {
        this.loading = false;
        this.alertService.presentToast('Registration Failed');
      }
    } catch (error) {
      this.errorService.handleError(error, this.loading);
    }
  }
}
