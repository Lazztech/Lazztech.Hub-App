import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PwaInstallComponent } from './pwa-install.component';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

describe('PwaInstallComponent', () => {
  let component: PwaInstallComponent;
  let fixture: ComponentFixture<PwaInstallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PwaInstallComponent ],
      imports: [
        LoggerModule.forRoot(environment.logging),
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PwaInstallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
