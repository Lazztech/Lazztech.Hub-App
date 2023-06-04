import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';
import { GeofenceService } from '../services/geofence/geofence.service';
import { NotificationsService } from '../services/notifications/notifications.service';
import { ErrorService } from '../services/error.service';

@Injectable({
  providedIn: 'root'
})
export class SetupGuard  {

  constructor(
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private geofenceService: GeofenceService,
    private errorService: ErrorService
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    try {
      const isAuthed = await this.authService.getToken();
      // user is signed in
      if (isAuthed) {
          // setup background geolocation
          await this.geofenceService.configureBackgroundGeolocation();
          let state = await this.geofenceService.ready();
          if (!state.enabled) {
            state = await this.geofenceService.start();
          }
          // hydrate hub geofences
          // FIXME: Should this be updated on polling of users hubs?
          // Also is this why I get recurring notifications about entering a hub that I'm
          // already at, because this is firing in the background every time the app starts
          // up for the backgroundgeolocation plugin???
          this.geofenceService.syncGeofences()
            .then(() => console.log('done with geofenceService.syncGeofences()')); 

          // permissions
          this.notificationsService.setupPushNotifications()
            .then(() => console.log('done with notificationsService.setupPushNotifications()'));
      }
    } catch (error) {
      this.errorService.handleError(error);
    }

    return true;
  }
  
}
