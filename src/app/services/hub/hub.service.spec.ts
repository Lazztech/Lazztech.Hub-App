import { TestBed } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HubService } from './hub.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('HubService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerModule.forRoot(environment.logging),
      ApolloTestingModule,
      IonicStorageModule.forRoot(),
    ]
  }));

  it('should be created', () => {
    const service: HubService = TestBed.get(HubService);
    expect(service).toBeTruthy();
  });
});
