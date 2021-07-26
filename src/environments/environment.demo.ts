// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { BrowserOptions } from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { LoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { UsersHubsQuery } from 'src/generated/graphql';
import { Environment, EnvironmentNames } from './environment.interface';

export const environment: Environment = {
  production: false,
  demoMode: true,
  name: EnvironmentNames.Demo,
  serverUrl: 'https://dev-lazztechhub.lazz.tech/',
  demoData: {
    usersLocation: {
      latitude: 47.62503181002362,
      longitude: -122.32099987619077,
    },
    usersHubs: <UsersHubsQuery>{
      usersHubs: [
        {
          hub: {
            name: 'Ada\'s',
            image: 'https://media.shelf-awareness.com/theshelf/2020_Edit_Content/ada_s_technical_books_fb_082320.jpg',
            latitude: 47.62332585418733,
            longitude: -122.31285954232902,
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
            name: 'Sasha\'s Crib',
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
        {
          hub: {
            name: 'Cal Anderson',
            image: 'https://www.seattlebikeblog.com/wp-content/uploads/2010/10/IMG_0113_2.jpg',
            latitude: 47.61576652330118,
            longitude: -122.31984121206752,
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
            ]
          },
          isPresent: false,
          isOwner: true
        },
      ]
     }
  },
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
  } as LoggerConfig,
  backgroundGeoLocationConfig: {
    reset: true,
    // debug: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // FIXME do not publish app with this set to verbose!
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    // url: 'http://my.server.com/locations',
    // autoSync: true,
    stopOnTerminate: false,
    startOnBoot: true
  },
  sentry: {
    dsn: 'https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414'
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
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
