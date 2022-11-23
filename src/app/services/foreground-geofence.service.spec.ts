import { TestBed } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { ForegroundGeofenceService } from './foreground-geofence.service';

describe('ForegroundGeofenceService', () => {
  let service: ForegroundGeofenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(environment.logging),
      ]
    });
    service = TestBed.inject(ForegroundGeofenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
