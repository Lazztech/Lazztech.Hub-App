import { TestBed } from '@angular/core/testing';

import { DebuggerService } from './debugger.service';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

describe('DebuggerService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerModule.forRoot(environment.logging),
    ]
  }));

  it('should be created', () => {
    const service: DebuggerService = TestBed.get(DebuggerService);
    expect(service).toBeTruthy();
  });
});
