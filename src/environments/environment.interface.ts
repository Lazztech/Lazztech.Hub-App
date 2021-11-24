import { BrowserOptions } from '@sentry/browser';
import { LoggerConfig } from 'ngx-logger';
import { Config as BackgroundGeolocationConfig } from '@transistorsoft/capacitor-background-geolocation';

export interface Environment {
    production: boolean;
    demoMode: boolean;
    demoData?: any;
    name: EnvironmentNames;
    serverUrl: string;
    legal: {
      privacyPolicyLink: string
      termsAndConditions: string
    };
    featureFlags: {
      statusPage: boolean,
      hubActivityDetails: boolean,
      paidHubSubscriptionTier: boolean,
      // https://github.com/adorableio/avatars-api-middleware
      adorableAvatarsUserImage: boolean,
      uberRequestRide: boolean,
      microChat: boolean,
      lightDarkThemeToggle: boolean,
      inviteUsersCheckList: boolean,
    };
    logging: LoggerConfig;
    backgroundGeoLocationConfig: BackgroundGeolocationConfig;
    sentry: BrowserOptions;
    apollo: {
      connectToDevTools: boolean
    };
}

export enum EnvironmentNames {
    Local = 'Local',
    Development = 'Development',
    Stage = 'Stage',
    Production = 'Production',
    Demo = 'Demo'
}
