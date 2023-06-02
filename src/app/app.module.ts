import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy, isPlatform } from '@ionic/angular';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ServiceWorkerModule } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage-angular';
import { environment } from '../environments/environment';

import { ReactiveFormsModule } from '@angular/forms';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { OpenNativeSettings } from '@awesome-cordova-plugins/open-native-settings/ngx';
import {
  CompositePropagatorModule,
  OpenTelemetryInterceptorModule,
  OTEL_LOGGER,
  OtelColExporterModule,
} from '@jufab/opentelemetry-angular-interceptor';
import * as Sentry from '@sentry/browser';
import BackgroundGeolocation from '@transistorsoft/capacitor-background-geolocation';
import { LoggerModule, NGXLogger } from 'ngx-logger';
import { SentryIonicErrorHandler } from './errors/sentryIonicErrorHandler';
import { GraphQLModule } from './graphql.module';
import { HttpRequestInterceptor } from './interceptors/http.interceptor';
import { ProfilePageModule } from './pages/profile/profile.module';
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
    ],
    providers: [
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        { provide: ErrorHandler, useClass: SentryIonicErrorHandler },
        { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
        { provide: OTEL_LOGGER, useExisting: NGXLogger },
        BackgroundGeolocation,
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

