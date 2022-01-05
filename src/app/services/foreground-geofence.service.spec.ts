import { TestBed } from '@angular/core/testing';

import { ForegroundGeofenceService } from './foreground-geofence.service';

describe('ForegroundGeofenceService', () => {
  let service: ForegroundGeofenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForegroundGeofenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
