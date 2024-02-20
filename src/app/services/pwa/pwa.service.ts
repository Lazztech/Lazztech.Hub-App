import { Injectable } from '@angular/core';
import { AlertController, ModalController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { PwaInstallComponent } from 'src/app/components/pwa-install/pwa-install.component';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  private deferredPrompt: any;
  beforeInstall: Observable<boolean>;

  constructor(
    private alertController: AlertController,
    private modalController: ModalController,
  ) {
    this.registerInstallPrompt();
  }

  private registerInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      this.beforeInstall = of(true);
      console.log('beforeinstallprompt Event fired');
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Stash the event so it can be triggered later.
      this.deferredPrompt = e;
    });
  }

  async presentAlert() {
    const modal = await this.modalController.create({
      component: PwaInstallComponent,
      showBackdrop: true,
      backdropDismiss: true,
      cssClass: ['alert-modal'],
    });
    return await modal.present();
  }
  
  showInstallBanner() {
    this.presentAlert();
    if (this.deferredPrompt !== undefined && this.deferredPrompt !== null) {
      // Show the prompt
      this.deferredPrompt.prompt();
      // Wait for the user to respond to the prompt
      this.deferredPrompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        // We no longer need the prompt.  Clear it up.
        this.deferredPrompt = null;
      });
    }
  }
  
}