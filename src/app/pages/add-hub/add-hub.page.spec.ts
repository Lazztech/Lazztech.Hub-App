import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AddHubPage } from './add-hub.page';
import { ReactiveFormsModule } from '@angular/forms';
import { IonRouterOutlet } from '@ionic/angular';

describe('AddHubPage', () => {
  let component: AddHubPage;
  let fixture: ComponentFixture<AddHubPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        ReactiveFormsModule
        ,
      ],
      providers: [
        {
          provide: IonRouterOutlet,
          useValue: {
            //add whatever property of IonRouterOutlet you're using in component class
            nativeEl: ""
          }
        }
      ],
      declarations: [ AddHubPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
