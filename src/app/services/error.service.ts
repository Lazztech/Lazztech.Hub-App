import { Injectable } from '@angular/core';
import { AlertService } from './alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  constructor(
    private alertService: AlertService,
  ) { }

  async handleError(err: any, loading?: boolean) {
    await this.alertService.presentRedToast(`Whoops, something went wrong... ${err}`);
    if (loading) {
      loading = false;
    }
  }
}
