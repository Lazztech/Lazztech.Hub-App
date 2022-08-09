import { Component, OnInit } from '@angular/core';
import { Clipboard } from '@capacitor/clipboard';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NavController } from '@ionic/angular';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { environment } from '../../../../environments/environment';
import { cache } from '../../../graphql.module';
import { AlertService } from '../../../services/alert/alert.service';
import { DebuggerService } from '../../../services/debugger/debugger.service';
import { GeofenceService } from '../../../services/geofence/geofence.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';
import { Browser } from '@capacitor/browser';
import { CommunicationService } from 'src/app/services/communication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  environment = environment;
  backgroundGeoLocationState = this.geofenceService.getBackgroundGeolocationState();
  pushNotificationToken = this.notificationService.getNativePushNotificationToken();
  geofencesFromBackgroundGeolocationDB = BackgroundGeolocation.getGeofences();
  locationsFromBackgroundGeolocationDB = BackgroundGeolocation.getLocations();
  cache = cache;

  loading = false;

  myForm: FormGroup;

  ageRestriction = 16;

  get firstName() {
    return this.myForm.get('firstName');
  }

  get lastName() {
    return this.myForm.get('lastName');
  }

  get email() {
    return this.myForm.get('email');
  }

  get phoneNumber() {
    return this.myForm.get('phoneNumber');
  }

  public countries: Array<{ code: number, flag: string, region: string}> = [];


  constructor(
    private navCtrl: NavController,
    private notificationService: NotificationsService,
    private profileService: ProfileService,
    private geofenceService: GeofenceService,
    private alertService: AlertService,
    private debuggerService: DebuggerService,
    private readonly communicationService: CommunicationService,
    private fb: FormBuilder,
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
      phoneNumber: [],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
    });
  }

  save() {}

  async changeName() {
    this.navCtrl.navigateForward('change-name');
  }

  async changeEmail() {
    this.navCtrl.navigateForward('change-email');
  }

  async changePhoneNumberl() {
    this.navCtrl.navigateForward('change-phone-number');
  }

  async changePassword() {
    this.navCtrl.navigateForward('change-password');
  }

  async deleteAccount() {
    this.navCtrl.navigateForward('delete-account');
  }

  async clearStorage() {
    await this.profileService.clearStorage();
  }

  openPrivacyPolicy() {
    Browser.open({ url: environment.legal.privacyPolicyLink });
  }

  openTermsAndConditions() {
    Browser.open({ url: environment.legal.termsAndConditions });
  }

  async copyPushNotificationToken() {
    await Clipboard.write({
      string: await this.pushNotificationToken
    });
    await this.alertService.presentToast('Push Notification Token Copied');
  }

  async emailBackgroundGeolocationLogs() {
    // FIXME
    await BackgroundGeolocation.logger.emailLog('gianlazzarini@gmail.com').then((success) => {
      console.log('[emailLog] SUCCESS');
      alert('[emailLog] SUCCESS');
    }).catch((error) => {
      console.log('[emailLog] ERROR: ', error);
      alert('[emailLog] ERROR)');
    });
  }

  async testLocalNotification() {
    LocalNotifications.schedule({
      notifications: [
        {
          title: 'Test Local Notification',
          body: 'test local notification',
          id: 1,
          schedule: { at: new Date(Date.now()) },
          sound: 'beep.aiff',
          attachments: null,
          actionTypeId: '',
          extra: null,
        }
      ]
    });
  }

  async startBackgroundGeolocation() {
    await BackgroundGeolocation.start();
  }

  async stopBackgroundGeolocation() {
    await BackgroundGeolocation.stop();
  }

  async toggleBackgroundGeolocationDebugMode() {
    const originalState = await this.geofenceService.getBackgroundGeolocationState();
    const newState = await BackgroundGeolocation.setConfig({
      ...originalState,
      debug: !originalState.debug
    });

    this.alertService.presentToast(`BackgroundGeolocation Debug Mode: ${newState.debug}`);
  }

  async startEruda() {
    this.debuggerService.start();
    await this.alertService.presentToast('Started Eruda Debugger');
  }

  async stopEruda() {
    this.debuggerService.stop();
    await this.alertService.presentToast('Stopped Eruda Debugger');
  }

}
