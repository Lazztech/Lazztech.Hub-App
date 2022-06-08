import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminEventPageRoutingModule } from './admin-event-routing.module';

import { AdminEventPage } from './admin-event.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminEventPageRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [AdminEventPage]
})
export class AdminEventPageModule {}
