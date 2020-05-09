import { NgxLoggerLevel, LoggerConfig } from 'ngx-logger';
import { FirebaseOptions } from '@firebase/app-types';

export const environment = {
  production: true,
  logging: {
    level: NgxLoggerLevel.DEBUG,
    serverLogLevel: NgxLoggerLevel.DEBUG,
    // serverLoggingUrl: ''
  } as LoggerConfig,
  firebaseConfig: {
    apiKey: "AIzaSyBBglG9CZgnduympgyS4mjSwVR8apl2Ztw",
    authDomain: "stack-push-notifications.firebaseapp.com",
    databaseURL: "https://stack-push-notifications.firebaseio.com",
    projectId: "stack-push-notifications",
    storageBucket: "",
    messagingSenderId: "770608014197",
    appId: "1:770608014197:web:95204a00ce87de89",
    vapidKey: 'BIt104gFwsv7X4-5R9vW9RIGV1TtMUHvRFsrMWWI5ez162UkiKbJpQL6Iq9n_ELYqG6FiTNLFQWidq-Kid6s9EE'
  } as FirebaseOptions
};

// export const SERVER_URL = 'https://lazztechhubdev.azurewebsites.net/graphql';
export const SERVER_URL = 'https://lazztechhub.azurewebsites.net/graphql';
// export const SERVER_URL = 'https://hubserver.lazz.tech/graphql';

export const GOOGLE_MAPS_KEY = 'AIzaSyB3v329F0sXT3vhrJncIfP_N1ipiNuXZOw';