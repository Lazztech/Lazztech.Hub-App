import { BrowserOptions } from '@sentry/browser';
import { LoggerConfig, NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  production: true,
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
    // serverLoggingUrl: ''
  } as LoggerConfig,
  sentry: {
    dsn: "https://772d0460b07a4d968cc3829a395ea446@o388920.ingest.sentry.io/5226414"
  } as BrowserOptions,
};

export const SERVER_URL = 'https://stg-lazztechhub.lazz.tech/';