import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvatarLoaderComponent } from './avatar-loader.component';

describe('AvatarLoaderComponent', () => {
  let component: AvatarLoaderComponent;
  let fixture: ComponentFixture<AvatarLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AvatarLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvatarLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
