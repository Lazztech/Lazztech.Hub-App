import { Injectable } from '@angular/core';
import { AlertService } from './alert/alert.service';
import * as Sentry from '@sentry/browser';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private alertService: AlertService,
    private router: Router,
    private authService: AuthService,
  ) { }

  async handleError(err: any, loading?: boolean) {
    if (err?.graphQLErrors?.length && err?.graphQLErrors[0]?.extensions?.code === 'UNAUTHENTICATED') {
      loading = false;
      this.authService.logout();
      this.router.navigate(['/landing']);
      return;
    }

    try {
      Sentry.captureException(err.originalError || err);
    } catch (e) {
      console.error(e);
      await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    }

    if (loading) {
      loading = false;
    }
  }
}
