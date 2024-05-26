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
        BrowserModule,
        IonicModule.forRoot({
          mode: !isPlatform('android') ? 'ios' : 'md',
          swipeBackEnabled: isPlatform('pwa') || isPlatform('mobileweb') ? false : true,
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

