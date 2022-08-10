import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarPipe } from './avatar.pipe';
import { PhoneNumberFormatterPipe } from './phone-number-formatter.pipe';



@NgModule({
  declarations: [AvatarPipe, PhoneNumberFormatterPipe],
  imports: [
    CommonModule
  ],
  exports: [AvatarPipe, PhoneNumberFormatterPipe]
})
export class PipesModule { }
