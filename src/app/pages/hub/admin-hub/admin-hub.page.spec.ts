import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule, IonRouterOutlet } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AdminHubPage } from './admin-hub.page';
import { ReactiveFormsModule } from '@angular/forms';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AdminHubPage', () => {
  let component: AdminHubPage;
  let fixture: ComponentFixture<AdminHubPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
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
  }));

  // for some reasone this must be done here as apposed to the
  // waitForAsync callback, otherwise it times out due to the
  // apollo client polling?..
  beforeEach(() => {
    fixture = TestBed.createComponent(AdminHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
