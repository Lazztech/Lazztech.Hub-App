import { TestBed } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { GeofenceService } from './geofence.service';

describe('GeofenceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerModule.forRoot(environment.logging),
      ApolloTestingModule,
    ],
  }));

  it('should be created', () => {
    const service: GeofenceService = TestBed.get(GeofenceService);
    expect(service).toBeTruthy();
  });
});
