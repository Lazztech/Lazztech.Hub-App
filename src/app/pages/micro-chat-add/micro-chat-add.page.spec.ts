import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

import { MicroChatAddPage } from './micro-chat-add.page';

describe('MicroChatAddPage', () => {
  let component: MicroChatAddPage;
  let fixture: ComponentFixture<MicroChatAddPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MicroChatAddPage ],
      imports: [
        IonicModule.forRoot(),
        ReactiveFormsModule,
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MicroChatAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
