import { Injectable } from '@angular/core';

import eruda from 'eruda';
import { AlertService } from '../alert/alert.service';

@Injectable({
  providedIn: 'root'
})
export class DebuggerService {

  public devModeEasterEggEnabled: boolean = false;
  private devModeEasterEggTimeoutId: any;
  private devModeEasterEggCount = 0;

  constructor(
    private readonly alertService: AlertService,
  ) { }

  async devModeEasterEgg() {
    clearTimeout(this.devModeEasterEggTimeoutId)
    this.devModeEasterEggCount += 1;
    console.log('devModeEasterEggCount: ', this.devModeEasterEggCount);
    if (this.devModeEasterEggCount >= 5 && !this.devModeEasterEggEnabled) {
      this.start();
      this.alertService.create({
        message: `✨✨ 🪄 You're a wizard now! 🪄 ✨✨`,
        duration: 2000,
        position: 'top',
        translucent: true,
      });
      this.devModeEasterEggEnabled = true;
      this.devModeEasterEggCount = 0;
    }
    this.devModeEasterEggTimeoutId = setTimeout(() => {
      this.devModeEasterEggCount = 0;
      console.log('reset devModeEasterEggCount: ', this.devModeEasterEggCount);
    }, 1000);
  }

  start() {
    eruda.init();
  }

  stop() {
    eruda.destroy();
  }
}
