import { TestBed } from '@angular/core/testing';

import { PushNotificationService } from './push-notification.service';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ServiceWorkerModule, SwPush } from '@angular/service-worker';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('PushNotificationService', () => {
  let service: PushNotificationService;

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
    service = TestBed.inject(PushNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
