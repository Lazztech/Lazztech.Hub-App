import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Storage } from '@ionic/storage';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings/ngx';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  constructor(
    private storage: Storage,
    private router: Router,
    private notificationsService: NotificationsService,
    private geofenceService: GeofenceService,
    private faio: FingerprintAIO,
    private nativeSettings: OpenNativeSettings
  ) { }

  ngOnInit() {
  }

  async pushNotifications() {
    await this.notificationsService.setupPushForAllPlatforms();
  }

  async geoPermissions() {
    await this.geofenceService.configureBackgroundGeolocation();
  }

  async finish() {
    await this.storage.set('tutorialCompleted', true);
    this.router.navigateByUrl('/tabs');
  }

  async openAppSettings() {
    this.nativeSettings
      .open('application_details')
      .then( res => {
        console.log(res);
      })
      .catch( err => {
        console.log(err);
      });
  }

}
