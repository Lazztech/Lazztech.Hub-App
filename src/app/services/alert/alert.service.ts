import { Injectable } from '@angular/core';
import { ToastController, ToastOptions } from '@ionic/angular';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor(
    private toastController: ToastController,
    private logger: NGXLogger
    ) { }

  async presentToast(message: any, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color: 'dark'
    });
    this.logger.log('presenting toast');
    await toast.present();
  }

  async create(opts?: ToastOptions) {
    const toast = await this.toastController.create(opts);
    await toast.present();
  }

  async presentRedToast(message: any, duration: number = 2000) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'top',
      color: 'danger'
    });
    this.logger.log('presenting toast');
    await toast.present();
  }

}
