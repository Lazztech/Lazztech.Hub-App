import { BrowserOptions } from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { LoggerConfig, NgxLoggerLevel } from 'ngx-logger';
import { Environment, EnvironmentNames } from './environment.interface';

export const environment: Environment = {
  production: false,
  demoMode: false,
  demoData: undefined,
  name: EnvironmentNames.Stage,
  serverUrl: 'https://stage-lazztechhub.lazz.tech/',
  legal: {
    privacyPolicyLink: "https://hub.lazz.tech/legal/privacy_policy.html",
    termsAndConditions: "https://hub.lazz.tech/legal/terms_and_conditions.html"
  },
  featureFlags: {
    statusPage: false,
    notificationsPage: false,
    hubActivityDetails: false,
    paidHubSubscriptionTier: false,
    //https://github.com/adorableio/avatars-api-middleware
    adorableAvatarsUserImage: true,
    uberRequestRide: true,
    microChat: true,
    lightDarkThemeToggle: false,
    inviteUsersCheckList: true,
  },
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
  } as LoggerConfig,
  geofenceRadius: 200,
  backgroundGeoLocationConfig: {
    reset: true,
    debug: false,
    logLevel: BackgroundGeolocation.LOG_LEVEL_VERBOSE, // do not publish app with this set to verbose!
    desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
    distanceFilter: 10,
    stopOnTerminate: false,
    startOnBoot: true,
    locationAuthorizationAlert: {
      titleWhenNotEnabled: "Location permission not allowed in the background?",
      titleWhenOff: "Location permission is off?",
      instructions: "Setting location permission to 'Always' will enable maps, and ensure that you are automatically checked in and out of your communities (even if the app is just running in the background).",
      cancelButton: "Ignore",
      settingsButton: "Settings"
    }
  },
  sentry: {
    dsn: "https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414"
  } as BrowserOptions,
  apollo: {
    connectToDevTools: false
  }
};