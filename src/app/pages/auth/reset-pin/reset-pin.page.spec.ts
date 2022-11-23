import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicStorageModule } from '@ionic/storage';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ResetPinPage } from './reset-pin.page';

describe('ResetPinPage', () => {
  let component: ResetPinPage;
  let fixture: ComponentFixture<ResetPinPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ResetPinPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        LoggerModule.forRoot(environment.logging),
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPinPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
