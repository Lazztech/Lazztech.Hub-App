import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { EventPage } from './event.page';
import { IonicStorageModule } from '@ionic/storage';

describe('EventPage', () => {
  let component: EventPage;
  let fixture: ComponentFixture<EventPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventPage ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        LoggerModule.forRoot(environment.logging),
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

    fixture = TestBed.createComponent(EventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
