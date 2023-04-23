import { Injectable } from '@angular/core';
import { AlertService } from './alert/alert.service';
import * as Sentry from '@sentry/browser';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private alertService: AlertService,
  ) { }

  async handleError(err: any, loading?: boolean) {
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
