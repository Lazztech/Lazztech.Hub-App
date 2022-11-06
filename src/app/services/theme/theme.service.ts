import { Injectable } from '@angular/core';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(
    private logger: NGXLogger
  ) { }

  async setLight() {
    document.body.classList.toggle('dark', false);
  }

  async setDark() {
    document.body.classList.toggle('dark', true);
  }

  isDark(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  async toggle() {
    const isDark = this.isDark();
    if (isDark) {
      this.logger.log('setting light');
      await this.setLight();
    } else {
      this.logger.log('setting dark');
      await this.setDark();
    }
  }
}
