import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminEventPageRoutingModule } from './admin-event-routing.module';

import { AdminEventPage } from './admin-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminEventPageRoutingModule
  ],
  declarations: [AdminEventPage]
})
export class AdminEventPageModule {}
