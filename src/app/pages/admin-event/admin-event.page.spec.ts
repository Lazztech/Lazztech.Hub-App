import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AdminEventPage } from './admin-event.page';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('AdminEventPage', () => {
  let component: AdminEventPage;
  let fixture: ComponentFixture<AdminEventPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminEventPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
        LoggerModule.forRoot(environment.logging),
        RouterTestingModule.withRoutes([]),
        ApolloTestingModule,
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

    fixture = TestBed.createComponent(AdminEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
