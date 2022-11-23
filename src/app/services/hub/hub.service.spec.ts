import { TestBed } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { HubService } from './hub.service';

describe('HubService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerModule.forRoot(environment.logging),
    ]
  }));

  it('should be created', () => {
    const service: HubService = TestBed.get(HubService);
    expect(service).toBeTruthy();
  });
});
