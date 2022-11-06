import { Component, OnInit } from '@angular/core';
import { MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from 'src/app/services/alert/alert.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  loading = false;
  myForm: FormGroup;

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
    private faio: FingerprintAIO,
    private notificationsService: NotificationsService,
    private logger: NGXLogger,
    private alertService: AlertService,
    private fb: FormBuilder,
  ) {
    this.menu.enable(false);
  }

  ionViewWillEnter() {
    this.authService.getToken().then(() => {
      if (this.authService.isLoggedIn) {
        this.faio.show({
          subtitle: 'authorize'
        }).then(async () => {
          await this.navCtrl.navigateRoot('/tabs');
        }).catch(err => this.logger.error(err));
      }
    });
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
    await this.navCtrl.navigateForward('/register');
  }

  async resetPassword() {
    await this.navCtrl.navigateForward('/reset-pin')
  }

  async login() {
    this.loading = true;
    const formValue = this.myForm.value;
    try {
      const token = await this.authService.login(formValue.email, formValue.password);
      if (token) {
        this.loading = false;
        await this.navCtrl.navigateRoot('/tabs');
      }
    } catch (error) {
      this.alertService.presentRedToast(`Login failed: ${error}`, 5000);
      this.loading = false;
    }
  }

  async triggerBioAuth() {
    this.authService.getToken().then(() => {
      if (this.authService.isLoggedIn) {
        this.faio.show({
          subtitle: 'authorize'
        }).then(async () => {
          await this.navCtrl.navigateRoot('/tabs');
        }).catch(err => this.logger.error(err));
      } else {
        this.alertService.presentRedToast('You must have logged into an active account recently.');
      }
    });
  }

}
