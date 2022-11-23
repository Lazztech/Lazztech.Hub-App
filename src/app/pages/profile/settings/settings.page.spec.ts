import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicStorageModule } from '@ionic/storage';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { SettingsPage } from './settings.page';
import { ReactiveFormsModule } from '@angular/forms';

describe('SettingsPage', () => {
  let component: SettingsPage;
  let fixture: ComponentFixture<SettingsPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot(),
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
        ReactiveFormsModule,
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
