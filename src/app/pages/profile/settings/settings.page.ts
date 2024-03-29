import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Browser } from '@capacitor/browser';
import { Clipboard } from '@capacitor/clipboard';
import { LocalNotifications } from '@capacitor/local-notifications';
import { NavController } from '@ionic/angular';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { AuthService } from 'src/app/services/auth/auth.service';
import { ErrorService } from 'src/app/services/error.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { MeGQL, UpdateUserGQL } from 'src/graphql/graphql';
import { environment } from '../../../../environments/environment';
import { cache } from '../../../graphql.module';
import { AlertService } from '../../../services/alert/alert.service';
import { DebuggerService } from '../../../services/debugger/debugger.service';
import { GeofenceService } from '../../../services/geofence/geofence.service';
import { NotificationsService } from '../../../services/notifications/notifications.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  environment = environment;
  backgroundGeoLocationState = this.geofenceService.getBackgroundGeolocationState();
  pushNotificationToken = this.notificationService.getNativePushNotificationToken();
  geofencesFromBackgroundGeolocationDB = this.geofenceService.getGeofences();
  locationsFromBackgroundGeolocationDB = this.geofenceService.getLocations();
  cache = cache;

  loading = false;

  myForm: UntypedFormGroup;

  ageRestriction = 16;

  completedInitialAccountSetup: boolean;

  get firstName() {
    return this.myForm.get('firstName');
  }

  get lastName() {
    return this.myForm.get('lastName');
  }

  get description() {
    return this.myForm.get('description');
  }

  get email() {
    return this.myForm.get('email');
  }

  get phoneNumber() {
    return this.myForm.get('phoneNumber');
  }

  get password() {
    return this.myForm.get('password');
  }


  constructor(
    private navCtrl: NavController,
    private notificationService: NotificationsService,
    private profileService: ProfileService,
    private geofenceService: GeofenceService,
    private alertService: AlertService,
    private debuggerService: DebuggerService,
    private fb: UntypedFormBuilder,
    private meService: MeGQL,
    private updateUserService: UpdateUserGQL,
    private authService: AuthService,
    private readonly errorService: ErrorService,
    public readonly debugService: DebuggerService,
  ) { }

  async ngOnInit() {
    this.loading = true;
    const me = await this.meService.fetch().toPromise();
    const user = me?.data?.me;

    this.completedInitialAccountSetup = await this.authService.completedInitialAccountSetup();
    console.log('completedInitialAccountSetup: ', this.completedInitialAccountSetup);

    if (!this.completedInitialAccountSetup) {
      this.myForm = this.fb.group({
        firstName: [user?.firstName, [
          Validators.required
        ]],
        lastName: [user?.lastName, [
          Validators.required
        ]],
        description: [user?.description],
        phoneNumber: [user?.phoneNumber],
        email: [user?.email, [
          Validators.required,
          Validators.email
        ]],
        password: ['', [
          Validators.required,
          Validators.minLength(10)
        ]]
      });
    } else {
      this.myForm = this.fb.group({
        firstName: [user?.firstName, [
          Validators.required
        ]],
        lastName: [user?.lastName, [
          Validators.required
        ]],
        description: [user?.description],
        phoneNumber: [user?.phoneNumber],
        email: [user?.email, [
          Validators.required,
          Validators.email
        ]],
      });
    }

    this.loading = false;
  }

  gotoNextField(nextElement){
    nextElement.setFocus();
  }

  async save() {
    try {
      this.loading = true;
      await this.updateUserService.mutate({
        data: {
          firstName: this.firstName?.value,
          lastName: this.lastName?.value,
          description: this.description?.value,
          phoneNumber: this.phoneNumber?.value,
          email: this.email?.value,
        }
      }).toPromise();

      if (!this.completedInitialAccountSetup && this.email?.value && this.password?.value) {
        const initialDetails = await this.authService.getExpeditedRegistrationDetails();
        await this.profileService.changePassword(
          initialDetails.password,
          this.password.value
        );
        this.authService.setInitialAccountSetupTrue();
        this.completedInitialAccountSetup = true;
        this.alertService.presentToast('Saved');
        this.loading = false;

        await this.authService.iOSAutofillSavePassword(this.email.value, this.password.value);
      } else {
        this.alertService.presentToast('Saved');
        this.loading = false;
      }
    } catch (error) {
      this.errorService.handleError(error, this.loading);
    }
  }

  async changePassword() {
    this.navCtrl.navigateForward('change-password');
  }

  async deleteAccount() {
    this.navCtrl.navigateForward('delete-account');
  }

  async clearStorage() {
    if (confirm('Are you sure you want to clear this apps storage?')) {
      await this.profileService.clearStorage();
    }    
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
