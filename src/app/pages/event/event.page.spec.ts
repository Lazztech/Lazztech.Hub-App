import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { EventPage } from './event.page';
import { IonicStorageModule } from '@ionic/storage';
import { EventGQL } from 'src/graphql/graphql';
import { HubService } from 'src/app/services/hub/hub.service';
import { ComponentsModule } from 'src/app/components/components.module';
import { Calendar } from '@awesome-cordova-plugins/calendar/ngx';

describe('EventPage', () => {
  let component: EventPage;
  let fixture: ComponentFixture<EventPage>;
  let eventGqlSpy;
  let hubServiceSpy;

  beforeEach(waitForAsync(() => {
    eventGqlSpy = jasmine.createSpyObj({
      watch: () => undefined,
    });
    hubServiceSpy = jasmine.createSpyObj({
      watchUsersPeople: () => undefined,
    })

    TestBed.configureTestingModule({
      declarations: [ EventPage ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        IonicStorageModule.forRoot(),
        ComponentsModule,
      ],
      providers: [
        {
          provide: IonRouterOutlet,
          useValue: {
            //add whatever property of IonRouterOutlet you're using in component class
            nativeEl: ""
          }
        },
        { provide: EventGQL, useValue: eventGqlSpy },
        { provide: HubService, useValue: hubServiceSpy },
        Calendar,
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
