import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { SetupGuard } from './setup.guard';

describe('SetupGuard', () => {
  let guard: SetupGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        LoggerModule.forRoot(environment.logging),
      ]
    });
    guard = TestBed.inject(SetupGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
