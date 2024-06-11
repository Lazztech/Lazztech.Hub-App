import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimYourAccountDialogComponent } from './claim-your-account-dialog.component';
import { IonicStorageModule, Storage } from '@ionic/storage-angular';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { LoggerModule } from 'ngx-logger';
import { environment } from 'src/environments/environment';

describe('ClaimYourAccountDialogComponent', () => {
  let component: ClaimYourAccountDialogComponent;
  let fixture: ComponentFixture<ClaimYourAccountDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClaimYourAccountDialogComponent ],
      imports: [
        IonicStorageModule.forRoot(),
        ApolloTestingModule,
        LoggerModule.forRoot(environment.logging),
      ]
    })
    .compileComponents();
    const storage: Storage = TestBed.get(Storage);
    await storage.create();

    fixture = TestBed.createComponent(ClaimYourAccountDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
