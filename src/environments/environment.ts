// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { BrowserOptions } from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Environment, EnvironmentNames } from './environment.interface';

export const environment: Environment = {
  production: false,
  demoMode: false,
  demoData: undefined,
  name: EnvironmentNames.Development,
  // serverUrl: 'https://dev-lazztechhub.lazz.tech/',
  serverUrl: 'https://lazztech-hub-service-z84zo.ondigitalocean.app/',
  webPushPublicVapidKey: 'BMNn-RZdnPe-KjKnfrAhq7Qbo89xUEi9VXGo80adRlMZiGl19lm3Rhuz7wbvO8ay8pa-a52w_v3xYLVwe4n0mHE',
  legal: {
    privacyPolicyLink: 'https://hub.lazz.tech/legal/privacy_policy.html',
    termsAndConditions: 'https://hub.lazz.tech/legal/terms_and_conditions.html'
  },
  featureFlags: {
    backgroundGeofence: false,
    statusPage: false,
    notificationsPage: false,
    hubActivityDetails: false,
    paidHubSubscriptionTier: false,
    // https://github.com/adorableio/avatars-api-middleware
    adorableAvatarsUserImage: true,
    uberRequestRide: true,
    lightDarkThemeToggle: false,
    inviteUsersCheckList: true,
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
  } as INGXLoggerConfig,
  geofenceRadius: 200,
  backgroundGeoLocationConfig: {
    reset: true,
    debug: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // do not publish app with this set to verbose!
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    stopOnTerminate: false,
    startOnBoot: true,
    useSignificantChangesOnly: true,
    locationAuthorizationAlert: {
      titleWhenNotEnabled: "Location permission not allowed in the background?",
      titleWhenOff: "Location permission is off?",
      instructions: "Setting location permission to 'Always' will enable maps, and ensure that you are automatically checked in and out of your communities (even if the app is just running in the background).",
      cancelButton: "Ignore",
      settingsButton: "Settings"
    }
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
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
