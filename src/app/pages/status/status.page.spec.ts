import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Diagnostic } from '@awesome-cordova-plugins/diagnostic/ngx';
import { IonicModule } from '@ionic/angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { StatusPage } from './status.page';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('StatusPage', () => {
  let component: StatusPage;
  let fixture: ComponentFixture<StatusPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StatusPage ],
      imports: [
        IonicModule.forRoot(),
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        IonicStorageModule.forRoot(),
      ],
      providers: [
        Diagnostic,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
