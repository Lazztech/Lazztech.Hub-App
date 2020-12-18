import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarPipe } from './avatar.pipe';



@NgModule({
  declarations: [AvatarPipe],
  imports: [
    CommonModule
  ],
  exports: [AvatarPipe]
})
export class PipesModule { }
