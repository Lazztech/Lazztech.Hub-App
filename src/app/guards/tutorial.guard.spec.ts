import { TestBed } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { TutorialGuard } from './tutorial.guard';

describe('TutorialGuard', () => {
  let guard: TutorialGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        LoggerModule.forRoot(environment.logging),
      ],
    });
    guard = TestBed.inject(TutorialGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
