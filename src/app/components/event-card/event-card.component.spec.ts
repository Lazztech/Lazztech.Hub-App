import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { MomentModule } from 'ngx-moment';
import { EventCardComponent } from './event-card.component';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

describe('EventCardComponent', () => {
  let component: EventCardComponent;
  let fixture: ComponentFixture<EventCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EventCardComponent ],
      imports: [
        IonicModule.forRoot(),
        ApolloTestingModule,
        MomentModule,
        LoggerModule.forRoot(environment.logging),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EventCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
