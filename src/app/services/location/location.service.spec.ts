import { TestBed } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { LocationService } from './location.service';
import { IonicStorageModule } from '@ionic/storage-angular';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('LocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerModule.forRoot(environment.logging),
      IonicStorageModule.forRoot(),
      ApolloTestingModule,
    ]
  }));

  it('should be created', () => {
    const service: LocationService = TestBed.get(LocationService);
    expect(service).toBeTruthy();
  });
});
