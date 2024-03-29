import { TestBed } from '@angular/core/testing';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { DiagnosticService } from './diagnostic.service';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('DiagnosticService', () => {
  let service: DiagnosticService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        IonicStorageModule.forRoot(),
      ],
      providers: [
        Diagnostic
      ]
    });
    service = TestBed.inject(DiagnosticService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
