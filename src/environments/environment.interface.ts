import { BrowserOptions } from '@sentry/browser';
import { INGXLoggerConfig } from 'ngx-logger';
import { Config as BackgroundGeolocationConfig } from '@transistorsoft/capacitor-background-geolocation';

export interface Environment {
    production: boolean;
    demoMode: boolean;
    demoData?: any;
    name: EnvironmentNames;
    serverUrl: string;
    webPushPublicVapidKey: string;
    legal: {
      privacyPolicyLink: string
      termsAndConditions: string
    };
    featureFlags: {
      backgroundGeofence: boolean,
      statusPage: boolean,
      notificationsPage: boolean,
      hubActivityDetails: boolean,
      paidHubSubscriptionTier: boolean,
      // https://github.com/adorableio/avatars-api-middleware
      adorableAvatarsUserImage: boolean,
      uberRequestRide: boolean,
      microChat: boolean,
      lightDarkThemeToggle: boolean,
      inviteUsersCheckList: boolean,
    };
    logging: INGXLoggerConfig;
    geofenceRadius: number;
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
