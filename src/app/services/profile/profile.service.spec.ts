import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';

import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      IonicStorageModule.forRoot(),
    ]
  }));

  it('should be created', () => {
    const service: ProfileService = TestBed.get(ProfileService);
    expect(service).toBeTruthy();
  });
});
