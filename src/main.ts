import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';
import { defineCustomElements } from '@ionic/pwa-elements/loader';
import '@khmyznikov/pwa-install';
import posthog from 'posthog-js'

posthog.init(
  'phc_rlAGH2vTNstyGtFXUJ5NzdJQTAM85wI6E9ibvA8LZai',
  {
    api_host:"https://us.i.posthog.com" // usually https://us.i.posthog.com or https://eu.i.posthog.com
  }
)

// Call the element loader after the platform has been bootstrapped
defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.log(err));
