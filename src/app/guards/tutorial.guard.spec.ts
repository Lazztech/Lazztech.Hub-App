import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';

import { TutorialGuard } from './tutorial.guard';

describe('TutorialGuard', () => {
  let guard: TutorialGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicStorageModule.forRoot(),
      ],
    });
    guard = TestBed.inject(TutorialGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
