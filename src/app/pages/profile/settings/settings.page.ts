import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { UpdateService } from 'src/app/services/update/update.service';
import { AlertService } from 'src/app/services/alert/alert.service';
import { ProfileService } from 'src/app/services/profile/profile.service';
import { NGXLogger } from 'ngx-logger';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { environment } from '../../../../environments/environment';
import { LocalNotifications } from '@capacitor/local-notifications';


@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {

  environment = environment;
  backgroundGeoLocationState = BackgroundGeolocation.getState();

  constructor(
    private navCtrl: NavController,
    private updateService: UpdateService,
    private alertService: AlertService,
    private profileService: ProfileService,
    private logger: NGXLogger
  ) { }

  ngOnInit() {
  }

  async changeName() {
    this.navCtrl.navigateForward('change-name');
  }

  async changeEmail() {
    this.navCtrl.navigateForward('change-email');
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

  async emailBackgroundGeolocationLogs() {
    // FIXME
    BackgroundGeolocation.logger.emailLog('gianlazzarini@gmail.com').then((success) => {
      console.log('[emailLog] SUCCESS');
      alert('[emailLog] SUCCESS')
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

}
