import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { EmailComposer } from '@awesome-cordova-plugins/email-composer/ngx';
import { IonicModule } from '@ionic/angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { QrPage } from './qr.page';

describe('QrPage', () => {
  let component: QrPage;
  let fixture: ComponentFixture<QrPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [QrPage],
      imports: [
        IonicModule.forRoot(),
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
      ],
      providers: [
        EmailComposer,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(QrPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
