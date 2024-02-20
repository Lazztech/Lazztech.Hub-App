import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PwaService {

  private deferredPrompt: any;
  beforeInstall: Observable<boolean>;

  constructor(
    private alertController: AlertController,
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
    const alert = await this.alertController.create({
      header: 'Install Lazztech Hub',
      subHeader: 'Install the app on your device to easily access it anytime. No app store. No download. No hassle.',
      message: `
        1. Tap on the share icon
        2. Select "Add to Home Screen"
      `,
      buttons: ['Understood'],
    });

    await alert.present();
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