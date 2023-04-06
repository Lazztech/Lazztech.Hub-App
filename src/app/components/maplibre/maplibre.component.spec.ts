import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaplibreComponent } from './maplibre.component';

describe('MaplibreComponent', () => {
  let component: MaplibreComponent;
  let fixture: ComponentFixture<MaplibreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaplibreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MaplibreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
