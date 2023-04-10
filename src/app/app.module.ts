import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy, isPlatform, Platform } from '@ionic/angular';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { IonicStorageModule } from '@ionic/storage';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { ReactiveFormsModule } from '@angular/forms';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { FingerprintAIO } from '@awesome-cordova-plugins/fingerprint-aio/ngx';
import { SentryIonicErrorHandler } from './errors/sentryIonicErrorHandler';
import * as Sentry from '@sentry/browser';
import { HttpRequestInterceptor } from './interceptors/http.interceptor';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { GraphQLModule } from './graphql.module';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import {
  OpenTelemetryInterceptorModule,
  OtelColExporterModule,
  CompositePropagatorModule,
  OTEL_LOGGER,
} from '@jufab/opentelemetry-angular-interceptor';
import { ProfilePageModule } from './pages/profile/profile.module';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { NgxIonicImageViewerModule } from 'ngx-ionic-image-viewer';
@NgModule({
    declarations: [AppComponent],
    imports: [
        OpenTelemetryInterceptorModule.forRoot({
          commonConfig: {
            console: environment.production ? false : true, // Display trace on console (only in DEV env)
            production: environment.production ? false : true, // Send Trace with BatchSpanProcessor (true) or SimpleSpanProcessor (false)
            serviceName: `Lazztech.Hub-App ${environment.name}`, // Service name send in trace
            probabilitySampler: '1',
          },
          otelcolConfig: {
            url: 'http://143.244.157.167:4318/v1/traces', // URL of opentelemetry collector
          },
        }),
        //Insert OtelCol exporter module
        OtelColExporterModule,
        //Insert propagator module
        CompositePropagatorModule,
        BrowserModule,
        IonicModule.forRoot({
          mode: !isPlatform('android') ? 'ios' : 'md',
        }),
        AppRoutingModule,
        HttpClientModule,
        IonicStorageModule.forRoot(),
        ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
        ReactiveFormsModule,
        LoggerModule.forRoot(environment.logging),
        GraphQLModule,
        ProfilePageModule,
        NgxIonicImageViewerModule
    ],
    providers: [
        StatusBar,
        SplashScreen,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
        { provide: OTEL_LOGGER, useExisting: NGXLogger },
        BackgroundGeolocation,
        FingerprintAIO,
        Diagnostic,
        OpenNativeSettings,
        EmailComposer,
        Calendar,
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor(
    ) {
    if (environment.production) {
      Sentry.init(environment.sentry);
    }
  }
}

