import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IonicModule } from '@ionic/angular';

import { PreviewHubPage } from './preview-hub.page';

describe('PreviewHubPage', () => {
  let component: PreviewHubPage;
  let fixture: ComponentFixture<PreviewHubPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviewHubPage ],
      imports: [
        IonicModule.forRoot(),
        RouterTestingModule.withRoutes([]),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PreviewHubPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
