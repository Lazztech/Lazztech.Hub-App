import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ChangePhoneNumberPageRoutingModule } from './change-phone-number-routing.module';

import { ChangePhoneNumberPage } from './change-phone-number.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ChangePhoneNumberPageRoutingModule
  ],
  declarations: [ChangePhoneNumberPage]
})
export class ChangePhoneNumberPageModule {}
