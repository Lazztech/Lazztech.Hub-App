import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ProfileComponent } from './profile.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { environment } from 'src/environments/environment';
import { LoggerModule } from 'ngx-logger';
import { DirectivesModule } from 'src/app/directives/directives.module';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ProfileComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        LoggerModule.forRoot(environment.logging),
        DirectivesModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
