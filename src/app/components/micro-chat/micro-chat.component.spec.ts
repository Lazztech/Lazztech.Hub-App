import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { MicroChatComponent } from './micro-chat.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('MicroChatComponent', () => {
  let component: MicroChatComponent;
  let fixture: ComponentFixture<MicroChatComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroChatComponent ],
      imports: [
        IonicModule.forRoot(),
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        ReactiveFormsModule,
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

    fixture = TestBed.createComponent(MicroChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
