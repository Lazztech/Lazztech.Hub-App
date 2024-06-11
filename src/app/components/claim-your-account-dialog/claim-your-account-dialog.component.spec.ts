import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimYourAccountDialogComponent } from './claim-your-account-dialog.component';

describe('ClaimYourAccountDialogComponent', () => {
  let component: ClaimYourAccountDialogComponent;
  let fixture: ComponentFixture<ClaimYourAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimYourAccountDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaimYourAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
