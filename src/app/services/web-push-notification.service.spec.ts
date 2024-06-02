import { TestBed } from '@angular/core/testing';

import { WebPushNotificationService } from './web-push-notification.service';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule, SwPush } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('WebPushNotificationService', () => {
  let service: WebPushNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: SwPush, useValue: {} },
      ],
      imports: [
        LoggerModule.forRoot(environment.logging),
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        ServiceWorkerModule.register('./ngsw-worker.js', { enabled: environment.production }),
      ]
    });
    service = TestBed.inject(WebPushNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
