import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaplibreComponent } from './maplibre.component';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

describe('MaplibreComponent', () => {
  let component: MaplibreComponent;
  let fixture: ComponentFixture<MaplibreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MaplibreComponent ],
      imports: [
        LoggerModule.forRoot(environment.logging),
      ]
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
