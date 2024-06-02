import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { Platform } from '@ionic/angular';
// import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';
// import { StatusBar } from '@awesome-cordova-plugins/status-bar/ngx';
import { RouterTestingModule } from '@angular/router/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppComponent } from './app.component';
import { IonicStorageModule } from '@ionic/storage-angular';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

class MockBackButton {
  subscribeWithPriority: jasmine.Spy<any>;
}

class MockPlatform {
  ready: jasmine.Spy<any>;
  backButton: any;
}

describe('AppComponent', () => {

  // let statusBarSpy;
  let splashScreenSpy;
  let platformReadySpy;
  let mockPlatform;
  let mockBackButton;

  beforeEach(waitForAsync(() => {
    // statusBarSpy = jasmine.createSpyObj('StatusBar', ['styleDefault']);
    // splashScreenSpy = jasmine.createSpyObj('SplashScreen', ['hide']);
    const platformReadySpy = jasmine.createSpy().and.returnValue(Promise.resolve());
    
    mockBackButton = new MockBackButton();
    mockBackButton.subscribeWithPriority = jasmine.createSpy('subscribeWithPriority', (priority, fn) => {});
    
    mockPlatform = new MockPlatform();
    mockPlatform.ready = platformReadySpy;
    mockPlatform.backButton = mockBackButton;

    TestBed.configureTestingModule({
      declarations: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        // { provide: StatusBar, useValue: statusBarSpy },
        // { provide: SplashScreen, useValue: splashScreenSpy },
        { provide: Platform, useValue: mockPlatform },
      ],
      imports: [ 
        RouterTestingModule.withRoutes([]),
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        LoggerModule.forRoot(environment.logging),
      ],
    }).compileComponents();
  }));

  it('should create the app', async () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  // it('should initialize the app', async () => {
  //   TestBed.createComponent(AppComponent);
  //   expect(mockPlatform.ready).toHaveBeenCalled();
  //   await platformReadySpy;
  //   expect(statusBarSpy.styleDefault).toHaveBeenCalled();
  //   expect(splashScreenSpy.hide).toHaveBeenCalled();
  // });

  // it('should have menu labels', async () => {
  //   const fixture = await TestBed.createComponent(AppComponent);
  //   await fixture.detectChanges();
  //   const app = fixture.nativeElement;
  //   const menuItems = app.querySelectorAll('ion-label');
  //   expect(menuItems.length).toEqual(2);
  //   expect(menuItems[0].textContent).toContain('Home');
  //   expect(menuItems[1].textContent).toContain('List');
  // });

  // it('should have urls', async () => {
  //   const fixture = await TestBed.createComponent(AppComponent);
  //   await fixture.detectChanges();
  //   const app = fixture.nativeElement;
  //   const menuItems = app.querySelectorAll('ion-item');
  //   expect(menuItems.length).toEqual(2);
  //   expect(menuItems[0].getAttribute('ng-reflect-router-link')).toEqual('/home');
  //   expect(menuItems[1].getAttribute('ng-reflect-router-link')).toEqual('/list');
  // });

});
