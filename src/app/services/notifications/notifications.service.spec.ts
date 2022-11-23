import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';

import { NotificationsService } from './notifications.service';

describe('NotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot(),
    ]
  }));

  it('should be created', () => {
    const service: NotificationsService = TestBed.get(NotificationsService);
    expect(service).toBeTruthy();
  });
});
