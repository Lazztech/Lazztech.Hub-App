// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { BrowserOptions } from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { LoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Environment, EnvironmentNames } from './environment.interface';

export const environment: Environment = {
  production: false,
  demoMode: false,
  demoData: undefined,
  name: EnvironmentNames.Development,
  serverUrl: 'https://dev-lazztechhub.lazz.tech/',
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
    microChat: false,
    lightDarkThemeToggle: false,
    inviteUsersCheckList: false
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
  } as LoggerConfig,
  backgroundGeoLocationConfig: {
    reset: true,
    debug: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // do not publish app with this set to verbose!
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    stopOnTerminate: false,
    startOnBoot: true,
  },
  sentry: {
    dsn: 'https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414'
  } as BrowserOptions,
  apollo: {
    connectToDevTools: true
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
