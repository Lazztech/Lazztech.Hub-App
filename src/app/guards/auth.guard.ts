import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(
    private router: Router,
    private authService: AuthService,
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
      const currentUser = this.authService.isLoggedIn;

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
