// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { BrowserOptions } from '@sentry/browser';
import { LoggerConfig, NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: false,
  legal: {
    privacyPolicyLink: 'https://lazz.tech/Lazztech.Hub/legal/privacy_policy.html',
    termsAndConditions: 'https://lazz.tech/Lazztech.Hub/legal/terms_and_conditions.html'
  },
  featureFlags: {
    statusPage: false,
    hubActivityDetails: false,
    paidHubSubscriptionTier: false,
    // https://github.com/adorableio/avatars-api-middleware
    adorableAvatarsUserImage: true,
    uberRequestRide: true,
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
    // serverLoggingUrl: ''
  } as LoggerConfig,
  sentry: {
    dsn: 'https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414'
  } as BrowserOptions,
};

// export const SERVER_URL = 'https://lazztech-hub-service-jvm2h.ondigitalocean.app/';
// export const SERVER_URL = 'https://hubserver.lazz.tech/';
// export const SERVER_URL = 'http://localhost:8080/';

export const SERVER_URL = 'https://dev-lazztechhub.lazz.tech/';

// TODO: Remove google maps related code
export const GOOGLE_MAPS_KEY = 'AIzaSyB3v329F0sXT3vhrJncIfP_N1ipiNuXZOw';

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
