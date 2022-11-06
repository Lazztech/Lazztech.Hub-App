import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Storage } from '@ionic/storage';
import { AuthService } from '../services/auth/auth.service';
import { GeofenceService } from '../services/geofence/geofence.service';
import { NotificationsService } from '../services/notifications/notifications.service';

@Injectable({
  providedIn: 'root'
})
export class TutorialGuard implements CanActivate {

  constructor(
    private storage: Storage,
    private router: Router,
    private authService: AuthService,
    private notificationsService: NotificationsService,
    private geofenceService: GeofenceService,
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const isComplete = await this.storage.get('tutorialCompleted');
    const isAuthed = await this.authService.getToken();
    if (!isComplete && isAuthed) {
      this.router.navigateByUrl('tutorial');
    }

    // user is signed in and completed tutorial
    if (isComplete && isAuthed) {
      try {
        // permissions
        await this.notificationsService.setupPushNotifications();
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
        await this.geofenceService.syncGeofences(); 
      } catch (error) {
        
      }
    }

    return isComplete;
  }

}
