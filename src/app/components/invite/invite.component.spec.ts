import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { InviteComponent } from './invite.component';

describe('InviteComponent', () => {
  let component: InviteComponent;
  let fixture: ComponentFixture<InviteComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InviteComponent ],
      imports: [
        IonicModule.forRoot(),
        LoggerModule.forRoot(environment.logging),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(InviteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
