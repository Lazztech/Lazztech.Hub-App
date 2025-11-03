import { Component, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { App, URLOpenListenerEvent } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { SplashScreen } from '@capacitor/splash-screen';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { NGXLogger } from 'ngx-logger';
import { AuthService } from './services/auth/auth.service';
import { ForegroundGeofenceService } from './services/foreground-geofence.service';
import { LocationService } from './services/location/location.service';
import { ThemeService } from './services/theme/theme.service';
import { WebPushNotificationService } from './services/web-push-notification.service';
import { SwUpdate, VersionEvent, VersionReadyEvent } from '@angular/service-worker';
import { filter } from 'rxjs';

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
  token: string;

  constructor(
    private platform: Platform,
    private themeService: ThemeService,
    private logger: NGXLogger,
    private router: Router,
    private zone: NgZone,
    private foregroundGeofenceService: ForegroundGeofenceService,
    public locationService: LocationService,
    public authService: AuthService,
    private storage: Storage,
    private update: SwUpdate,
  ) {
    this.initializeApp();
    this.updateClient();
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

      await this.locationService.watchPosition(
        (location) => this.foregroundGeofenceService.asses(location)
      );
    });
  }

  updateClient(){
    if (!this.update.isEnabled){
      console.log("SwUpdate not enabled");
      return;
    }
    
    if (this.update.isEnabled) {
      this.update.checkForUpdate().catch(() => {});
    }
    
    this.update.versionUpdates.pipe(filter((e: VersionEvent): e is VersionReadyEvent => e.type === 'VERSION_READY'))
    .subscribe(async (event) =>{
      console.log("sw update available");
      if(confirm("There's an update available, reload the app to apply?")){
        this.update.activateUpdate().then(() => location.reload());
      }
    });
  }
}
