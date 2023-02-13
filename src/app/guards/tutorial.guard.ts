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
  ) { }

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    const isComplete = await this.storage.get('tutorialCompleted');
    const isAuthed = await this.authService.getToken();
    if (!isComplete && isAuthed) {
      this.router.navigateByUrl('tutorial');
    }

    return isComplete;
  }

}
