import { TestBed } from '@angular/core/testing';

import { ErrorService } from './error.service';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

describe('ErrorService', () => {
  let service: ErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(environment.logging),
      ]
    });
    service = TestBed.inject(ErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
