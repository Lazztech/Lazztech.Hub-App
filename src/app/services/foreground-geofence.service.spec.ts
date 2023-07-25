import { TestBed } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ForegroundGeofenceService } from './foreground-geofence.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('ForegroundGeofenceService', () => {
  let service: ForegroundGeofenceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        IonicStorageModule.forRoot(),
      ]
    });
    service = TestBed.inject(ForegroundGeofenceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
