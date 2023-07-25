import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { NavController, Platform } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';
import { AlertService } from './services/alert/alert.service';
import { AuthService } from './services/auth/auth.service';
import { ForegroundGeofenceService } from './services/foreground-geofence.service';
import { LocationService } from './services/location/location.service';
import { ThemeService } from './services/theme/theme.service';
import { Storage } from '@ionic/storage-angular';

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
  isLoggedIn$;

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private themeService: ThemeService,
    private logger: NGXLogger,
    private router: Router,
    private zone: NgZone,
    private foregroundGeofenceService: ForegroundGeofenceService,
    public locationService: LocationService,
    private storage: Storage
  ) {
    this.initializeApp();
  }

  async initializeApp() {
    this.isDark = this.themeService.isDark();
    document.body.classList.toggle('dark', this.isDark);

    App.addListener('appUrlOpen', (event: URLOpenListenerEvent) => {
      this.zone.run(() => {
        const domain = 'lazz.tech';
        const appPath = event.url.split(domain).pop();
        if (appPath) {
          this.router.navigateByUrl(appPath);
        }
      });
    });

    this.platform.ready().then(async () => {
      this.logger.log('Ionic Platform Ready');
      if(Capacitor.isNativePlatform()) {
        await SplashScreen.hide();
        await StatusBar.setStyle({
          style: Style.Default,
        });
      }

      // If using a custom driver:
      // await this.storage.defineDriver(MyCustomDriver)
      await this.storage.create();

      this.isLoggedIn$ = this.authService.isLoggedIn$;

      await this.locationService.watchPosition(
        (location) => this.foregroundGeofenceService.asses(location)
      );
    });
  }
}
