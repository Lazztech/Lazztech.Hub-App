import { BrowserOptions } from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { LoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Environment, EnvironmentNames } from './environment.interface';

export const environment: Environment = {
  production: true,
  demoMode: false,
  demoData: undefined,
  name: EnvironmentNames.Stage,
  serverUrl: 'https://stg-lazztechhub.lazz.tech/',
  legal: {
    privacyPolicyLink: "https://lazz.tech/Lazztech.Hub/legal/privacy_policy.html",
    termsAndConditions: "https://lazz.tech/Lazztech.Hub/legal/terms_and_conditions.html"
  },
  featureFlags: {
    statusPage: false,
    hubActivityDetails: false,
    paidHubSubscriptionTier: false,
    //https://github.com/adorableio/avatars-api-middleware
    adorableAvatarsUserImage: true,
    uberRequestRide: true
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
  } as LoggerConfig,
  backgroundGeoLocationConfig: {
    reset: true,
    // debug: true,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // do not publish app with this set to verbose!
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    // url: 'http://my.server.com/locations',
    // autoSync: true,
    stopOnTerminate: false,
    startOnBoot: true
  },
  sentry: {
    dsn: "https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414"
  } as BrowserOptions,
  apollo: {
    connectToDevTools: false
  }
};