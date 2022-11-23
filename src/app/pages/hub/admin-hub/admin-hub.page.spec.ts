import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { AdminHubPage } from './admin-hub.page';

describe('AdminHubPage', () => {
  let component: AdminHubPage;
  let fixture: ComponentFixture<AdminHubPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminHubPage ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        LoggerModule.forRoot(environment.logging),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AdminHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
