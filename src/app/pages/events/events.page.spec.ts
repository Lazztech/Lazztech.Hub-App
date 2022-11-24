import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { UserEventsGQL } from 'src/graphql/graphql';
import { EventsPage } from './events.page';

describe('EventsPage', () => {
  let component: EventsPage;
  let fixture: ComponentFixture<EventsPage>;
  let userEventsGQLSpy;

  beforeEach(waitForAsync(() => {
    userEventsGQLSpy = jasmine.createSpyObj({
      watch: () => undefined
    });

    TestBed.configureTestingModule({
      declarations: [ EventsPage ],
      imports: [
        IonicModule.forRoot(),
        ApolloTestingModule,
      ],
      providers: [
        { provide: UserEventsGQL, useValue: userEventsGQLSpy },
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
