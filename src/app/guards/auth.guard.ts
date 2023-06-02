import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { NetworkService } from '../services/network/network.service';
import { AlertService } from '../services/alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private authService: AuthService,
    private networkService: NetworkService,
    private alertService: AlertService
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
      const currentUser = this.authService.isLoggedIn;

      // Done with callbacks so that it doesn't block causing sluggishness going between pages.
      // Note, this seems to be failing on cold starts with serverless
      this.networkService.isConnected().then((online) => {
        if (online) {
          this.authService.verifyAccountExists().then((stillValid) => {
            if (!stillValid) {
              this.authService.logout();
              this.router.navigate(['/landing']);
              return false;
            }
          });
        }
      });

      if (currentUser || (await this.authService.getToken())) {
          // authorized so return true
          return true;
      }
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/landing'], {
        queryParams: {
          returnUrl: state.url
        },
      });
      return false;
  }
}
