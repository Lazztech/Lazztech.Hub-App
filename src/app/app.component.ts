import { Component } from '@angular/core';
import { StatusBar, Style } from '@capacitor/status-bar';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { NavController, Platform } from '@ionic/angular';
import { AlertService } from './services/alert/alert.service';
import { AuthService } from './services/auth/auth.service';
import { GeofenceService } from './services/geofence/geofence.service';
import { NetworkService } from './services/network/network.service';
import { ThemeService } from './services/theme/theme.service';
import { UpdateService } from './services/update/update.service';
import { NGXLogger } from 'ngx-logger';
import { SplashScreen } from '@capacitor/splash-screen';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public appPages = [
    {
      title: 'Settings',
      url: '/tabs/profile',
      icon: 'settings'
    },
    {
      title: 'Invite',
      url: '/tabs/invite',
      icon: 'add'
    }
  ];

  isDark = false;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private navCtrl: NavController,
    private alertService: AlertService,
    private themeService: ThemeService,
    private geofenceService: GeofenceService,
    private logger: NGXLogger,
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    // this.isDark = await this.themeService.isDark();
    document.body.classList.toggle('dark', true);

    StatusBar.setStyle({
      style: Style.Dark
    });
    this.platform.ready().then(async () => {
      this.logger.log('Ionic Platform Ready');
      SplashScreen.hide();

      this.authService.getToken();

      // setup background geolocation
      await this.geofenceService.configureBackgroundGeolocation();
      let state = await this.geofenceService.ready();
      if (!state.enabled) {
        state = await this.geofenceService.start();
      }
      // hydrate hub geofences
      // FIXME: this needs to be performed more intelligently then just at startup.
      // Should this be updated on polling of users hubs?
      // Also is this why I get recurring notifications about entering a hub that I'm
      // already at, because this is firing in the background every time the app starts
      // up for the backgroundgeolocation plugin???
      await this.geofenceService.refreshHubGeofences();
    });
  }

  async logout() {
    await this.authService.logout();
    this.alertService.presentToast('Logged Out');
    this.navCtrl.navigateRoot('/landing');
  }
}
