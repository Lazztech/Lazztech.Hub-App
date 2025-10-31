// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { BrowserOptions } from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { INGXLoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { UserEventsQuery, UsersHubsQuery } from 'src/graphql/graphql';
import { Environment, EnvironmentNames } from './environment.interface';

export const environment: Environment = {
  production: false,
  demoMode: true,
  name: EnvironmentNames.Demo,
  serverUrl: 'http://localhost:8080/',
  webPushPublicVapidKey: 'BMNn-RZdnPe-KjKnfrAhq7Qbo89xUEi9VXGo80adRlMZiGl19lm3Rhuz7wbvO8ay8pa-a52w_v3xYLVwe4n0mHE',
  demoData: {
    usersLocation: {
      latitude: 47.62503181002362,
      longitude: -122.32099987619077,
    }, 
    usersEvents: <UserEventsQuery>{
      usersEvents: []
    },
    usersHubs: <UsersHubsQuery>{
      usersHubs: [
        {
          hub: {
            id: '123456789',
            name: 'Ada\'s',
            image: 'https://media.shelf-awareness.com/theshelf/2020_Edit_Content/ada_s_technical_books_fb_082320.jpg',
            latitude: 47.62332585418733,
            longitude: -122.31285954232902,
            locationLabel: "Capitol Hill, Seattle",
            active: true,
            usersConnection: [
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: false
              },
            ]
          },
          isPresent: false,
          isOwner: false
        },
        {
          hub: {
            id: '1234567899',
            name: 'Sarahs House',
            image: 'https://www.urbnlivn.com/wp-content/uploads/2020/07/1633425_0.jpg',
            latitude: 47.62503181002362,
            longitude: -122.32099987619077,
            active: false,
            usersConnection: [
              {
                isPresent: true
              },
              {
                isPresent: true
              },
              {
                isPresent: true
              },
            ]
          },
          isPresent: false,
          isOwner: true
        },
      ]
     }
  },
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
    debug: false,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // FIXME do not publish app with this set to verbose!
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
    dsn: ''
  } as BrowserOptions,
  apollo: {
    connectToDevTools: false
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
