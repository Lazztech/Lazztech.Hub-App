import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { Storage } from '@ionic/storage';
import { NotificationsService } from 'src/app/services/notifications/notifications.service';
import { GeofenceService } from 'src/app/services/geofence/geofence.service';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-tutorial',
  templateUrl: './tutorial.page.html',
  styleUrls: ['./tutorial.page.scss'],
})
export class TutorialPage implements OnInit {

  platform = Capacitor.getPlatform();

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

  async finish() {
    if (this.platform === 'android') {
      alert('Lazztech Hub collects location data to enable automatic check in and out of your community Hubs, even when the app is closed or not in use.');
    }
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
