import { Component, OnInit } from '@angular/core';
import { ModalController, MenuController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
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
    private modalController: ModalController,
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
          // FIXME is this how I want this? It needs token to work on first launch.
          await this.notificationsService.setupPushNotifications();

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
    const token = await this.authService.login(formValue.email, formValue.password);
    this.logger.log('Result: ' + token);
    if (token) {
      this.loading = false;
      // FIXME is this how I want this? It needs token to work on first launch.
      await this.notificationsService.setupPushNotifications();
      await this.navCtrl.navigateRoot('/tabs');
    } else {
      this.loading = false;
      this.alertService.presentRedToast('Login failed!');
    }
  }

  async triggerBioAuth() {
    this.authService.getToken().then(() => {
      if (this.authService.isLoggedIn) {
        this.faio.show({
          subtitle: 'authorize'
        }).then(async () => {
          // FIXME is this how I want this? It needs token to work on first launch.
          await this.notificationsService.setupPushNotifications();

          await this.navCtrl.navigateRoot('/tabs');
        }).catch(err => this.logger.error(err));
      } else {
        this.alertService.presentRedToast('You must have logged into an active account recently.');
      }
    });
  }

}
