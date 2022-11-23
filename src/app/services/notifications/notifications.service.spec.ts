import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot(),
      LoggerModule.forRoot(environment.logging),
    ]
  }));

  it('should be created', () => {
    const service: NotificationsService = TestBed.get(NotificationsService);
    expect(service).toBeTruthy();
  });
});
