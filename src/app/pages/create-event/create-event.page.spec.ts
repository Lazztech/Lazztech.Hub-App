import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { CreateEventPage } from './create-event.page';
import { MomentModule } from 'ngx-moment';
import { IonicStorageModule } from '@ionic/storage-angular';

describe('CreateEventPage', () => {
  let component: CreateEventPage;
  let fixture: ComponentFixture<CreateEventPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateEventPage ],
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

    fixture = TestBed.createComponent(CreateEventPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
