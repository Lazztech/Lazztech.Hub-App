import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

import { MapPage } from './map.page';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('MapPage', () => {
  let component: MapPage;
  let fixture: ComponentFixture<MapPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        LoggerModule.forRoot(environment.logging),
        ApolloTestingModule,
      ],
      declarations: [ MapPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
