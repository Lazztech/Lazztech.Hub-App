import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { UploadPage } from './upload.page';
import { MomentModule } from 'ngx-moment';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('UploadPage', () => {
  let component: UploadPage;
  let fixture: ComponentFixture<UploadPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UploadPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        MomentModule,
        IonicStorageModule.forRoot(),
      ],
      providers: [
        {
          provide: IonRouterOutlet,
          useValue: {
            //add whatever property of IonRouterOutlet you're using in component class
            nativeEl: ""
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UploadPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
